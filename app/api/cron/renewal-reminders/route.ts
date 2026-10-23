import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import { renewalReminderEmail } from "@/lib/email/templates";
import { planName, renewEvery } from "@/lib/plans";
import { formatAmount } from "@/lib/payments";

// Runs once a day (see vercel.json). Emails families whose plan renews in
// about 3 days. Vercel sends "Authorization: Bearer <CRON_SECRET>".
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
  return NextResponse.json({ sent });
}
