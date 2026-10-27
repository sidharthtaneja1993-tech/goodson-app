import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import {
  checkoutFollowupEmail,
  intakeReminderEmail,
  renewalReminderEmail,
} from "@/lib/email/templates";
import { onboardingUrl } from "@/lib/onboarding";
import { whatsappLink } from "@/lib/whatsapp";
import { planName, renewEvery } from "@/lib/plans";
import { formatAmount } from "@/lib/payments";

// Runs once a day (see vercel.json). Vercel sends "Authorization: Bearer <CRON_SECRET>".
// Sends three kinds of automatic emails, each at most once per person:
//   1. Renewal reminders - plan renews in about 3 days.
//   2. Checkout follow-ups - entered details yesterday but didn't pay.
//   3. Parents'-details reminders - paid, but haven't filled in the form after a day.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const resend = getResendClient();
  if (!db || !resend) return NextResponse.json({ sent: 0, note: "not configured" });

  const now = Date.now();
  const from = new Date(now + 2 * 86400000).toISOString();
  const to = new Date(now + 4 * 86400000).toISOString();

  const { data: due } = await db
    .from("subscriptions")
    .select("*")
    .eq("status", "active")
    .eq("cancel_requested", false)
    .gte("current_end", from)
    .lte("current_end", to);

  let sent = 0;
  const sender = process.env.RESEND_FROM_EMAIL || "Goodson <onboarding@resend.dev>";
  for (const row of due ?? []) {
    if (row.reminder_sent_for && row.reminder_sent_for === row.current_end) continue;
    const date = new Date(row.current_end).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    try {
      await resend.emails.send({
        from: sender,
        to: row.email,
        ...renewalReminderEmail({
          name: row.name,
          plan: planName(row.plan),
          every: renewEvery(row.term),
          amount: formatAmount(row.amount, row.currency),
          date,
        }),
      });
      await db.from("subscriptions").update({ reminder_sent_for: row.current_end }).eq("id", row.id);
      sent++;
    } catch (e) {
      console.error("Reminder failed for", row.email, e);
    }
  }
  const followups = await sendCheckoutFollowups(db, resend, sender);
  const intakeReminders = await sendIntakeReminders(db, resend, sender);
  return NextResponse.json({ sent, followups, intakeReminders });
}

type Db = NonNullable<ReturnType<typeof createAdminClient>>;
type Mailer = NonNullable<ReturnType<typeof getResendClient>>;
const HOUR = 3600000;
const norm = (e: unknown) => String(e ?? "").trim().toLowerCase();

/** People who entered their details 12h-7 days ago, never paid, and haven't had a follow-up. */
async function sendCheckoutFollowups(db: Db, resend: Mailer, from: string) {
  const now = Date.now();
  const { data: leads, error } = await db
    .from("waitlist")
    .select("id, name, email, plan, created_at")
    .is("followup_sent_at", null)
    .lte("created_at", new Date(now - 12 * HOUR).toISOString())
    .gte("created_at", new Date(now - 7 * 24 * HOUR).toISOString());
  if (error) {
    console.error("Checkout follow-ups skipped (run migration 008?):", error.message);
    return 0;
  }
  if (!leads?.length) return 0;

  const [{ data: paid }, { data: subs }] = await Promise.all([
    db.from("payments").select("email").eq("status", "paid"),
    db.from("subscriptions").select("email").gt("paid_count", 0),
  ]);
  const paidEmails = new Set([...(paid ?? []), ...(subs ?? [])].map((r) => norm(r.email)));

  // One email per person, even if they opened checkout several times.
  const byEmail = new Map<string, typeof leads>();
  for (const l of leads) {
    const key = norm(l.email);
    if (!key) continue;
    byEmail.set(key, [...(byEmail.get(key) ?? []), l]);
  }

  let count = 0;
  for (const [email, rows] of byEmail) {
    const ids = rows.map((r) => r.id);
    if (!paidEmails.has(email)) {
      const latest = rows[rows.length - 1];
      try {
        await resend.emails.send({
          from,
          to: latest.email,
          ...checkoutFollowupEmail({
            name: latest.name,
            plan: latest.plan,
            whatsappUrl: whatsappLink("Hi Goodson, I started subscribing on the website and have a question."),
          }),
        });
        count++;
      } catch (e) {
        console.error("Checkout follow-up failed for", latest.email, e);
        continue;
      }
    }
    // Mark paid people too, so they're never checked again.
    await db.from("waitlist").update({ followup_sent_at: new Date().toISOString() }).in("id", ids);
  }
  return count;
}

/** Paying families who haven't filled in their parents' details 20h-7 days after paying. */
async function sendIntakeReminders(db: Db, resend: Mailer, from: string) {
  const now = Date.now();
  const { data: pending, error } = await db
    .from("parent_intakes")
    .select("id, token, name, email")
    .eq("status", "pending")
    .is("reminder_sent_at", null)
    .lte("created_at", new Date(now - 20 * HOUR).toISOString())
    .gte("created_at", new Date(now - 7 * 24 * HOUR).toISOString());
  if (error) {
    console.error("Intake reminders skipped (run migration 008?):", error.message);
    return 0;
  }

  let count = 0;
  for (const row of pending ?? []) {
    if (!row.email) continue;
    try {
      await resend.emails.send({
        from,
        to: row.email,
        ...intakeReminderEmail({ name: row.name || "there", onboardingUrl: onboardingUrl(row.token) }),
      });
      await db.from("parent_intakes").update({ reminder_sent_at: new Date().toISOString() }).eq("id", row.id);
      count++;
    } catch (e) {
      console.error("Intake reminder failed for", row.email, e);
    }
  }
  return count;
}
