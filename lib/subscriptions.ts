import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import {
  paymentReceivedEmail,
  paymentNotificationEmail,
  renewalChargedEmail,
  subscriptionAlertEmail,
} from "@/lib/email/templates";
import { planName, renewEvery, termLabel } from "@/lib/plans";
import { formatAmount } from "@/lib/payments";

// Shapes of the parts of Razorpay's subscription / payment objects we use.
export type RzpSubscription = {
  id: string;
  status: string;
  paid_count?: number;
  current_end?: number | null; // unix seconds
  notes?: Record<string, string>;
};
export type RzpPayment = {
  id: string;
  order_id?: string | null;
  amount: number;
  currency: string;
  email?: string;
  contact?: string;
};

function fromUnix(t?: number | null) {
  return t ? new Date(t * 1000).toISOString() : null;
}

async function sendEmails(jobs: { to: string; subject: string; html: string }[]) {
  const resend = getResendClient();
  if (!resend) return;
  const from = process.env.RESEND_FROM_EMAIL || "Goodson <onboarding@resend.dev>";
  const results = await Promise.allSettled(jobs.map((j) => resend.emails.send({ from, ...j })));
  results.forEach((r) => r.status === "rejected" && console.error("Subscription email failed:", r.reason));
}

/**
 * Records a successful subscription charge (first payment or a renewal).
 * Safe to call more than once for the same payment: emails go out only the first time.
 */
export async function recordCharge(sub: RzpSubscription, payment: RzpPayment) {
  const db = createAdminClient();
  if (!db) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set - subscription charge not saved:", sub.id);
    return;
  }

  const { data: rows } = await db
    .from("subscriptions")
    .update({
      status: "active",
      paid_count: sub.paid_count ?? 1,
      current_end: fromUnix(sub.current_end),
      last_payment_id: payment.id,
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_subscription_id", sub.id)
    .select("*");
  const row = rows?.[0];
  if (!row) {
    console.warn("Charge for unknown subscription:", sub.id);
    return;
  }

  // One payments row per charge - doubles as the "already handled?" check.
  const { data: inserted } = await db
    .from("payments")
    .upsert(
      {
        razorpay_order_id: payment.order_id || `subpay_${payment.id}`,
        razorpay_payment_id: payment.id,
        status: "paid",
        plan: row.plan,
        term: row.term,
        amount: payment.amount,
        currency: payment.currency,
        amount_usd: row.amount_usd,
        name: row.name,
        email: row.email,
        phone: row.phone,
        pincode: row.pincode,
        paid_at: new Date().toISOString(),
      },
      { onConflict: "razorpay_order_id", ignoreDuplicates: true }
    )
    .select("id");
  if (!inserted?.length) return; // this charge was already recorded

  const details = {
    name: row.name,
    email: row.email,
    phone: row.phone,
    plan: planName(row.plan),
    term: termLabel(row.term),
    amount: formatAmount(payment.amount, payment.currency),
    paymentId: payment.id,
  };
  const nextDate = row.current_end
    ? new Date(row.current_end).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const isFirst = (sub.paid_count ?? 1) <= 1;

  const jobs = [
    {
      to: row.email,
      ...(isFirst
        ? paymentReceivedEmail({
            ...details,
            note: `Your plan renews automatically every ${renewEvery(row.term)}${
              nextDate ? ` (next on ${nextDate})` : ""
            }. You can cancel anytime by messaging us on WhatsApp.`,
          })
        : renewalChargedEmail({ ...details, every: renewEvery(row.term), nextDate })),
    },
  ];
  if (process.env.NOTIFY_EMAIL) {
    jobs.push({
      to: process.env.NOTIFY_EMAIL,
      ...paymentNotificationEmail({ ...details, term: `${details.term}, auto-renew${isFirst ? "" : " renewal"}` }),
    });
  }
  await sendEmails(jobs);
}

/** Updates a subscription's status (activated, halted, cancelled ...) and alerts the team when it matters. */
export async function updateStatus(sub: RzpSubscription, status: string) {
  const db = createAdminClient();
  if (!db) return;
  const { data: rows } = await db
    .from("subscriptions")
    .update({
      status,
      current_end: fromUnix(sub.current_end) ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_subscription_id", sub.id)
    .neq("status", status)
    .select("*");
  const row = rows?.[0];
  if (!row || !process.env.NOTIFY_EMAIL) return;

  if (status === "halted" || status === "pending" || status === "cancelled") {
    await sendEmails([
      {
        to: process.env.NOTIFY_EMAIL,
        ...subscriptionAlertEmail({
          status,
          name: row.name,
          email: row.email,
          phone: row.phone,
          plan: planName(row.plan),
          term: termLabel(row.term),
        }),
      },
    ]);
  }
}
