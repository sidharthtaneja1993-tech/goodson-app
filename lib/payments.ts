import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import { paymentReceivedEmail, paymentNotificationEmail } from "@/lib/email/templates";
import { getPlan, termLabel } from "@/lib/plans";

/**
 * Marks an order as paid. Safe to call twice (from the checkout callback and
 * the webhook) - the confirmation emails only go out the first time.
 */
export async function markPaid(orderId: string, paymentId: string) {
  const db = createAdminClient();
  if (!db) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not set - payment verified but not saved:", orderId);
    return;
  }

  const { data: updated, error } = await db
    .from("payments")
    .update({ status: "paid", razorpay_payment_id: paymentId, paid_at: new Date().toISOString() })
    .eq("razorpay_order_id", orderId)
    .neq("status", "paid")
    .select("*");

  if (error) {
    console.error("Could not mark payment paid:", error.message);
    return;
  }
  const row = updated?.[0];
  if (!row) return; // already marked paid earlier

  const resend = getResendClient();
  if (!resend) return;
  const from = process.env.RESEND_FROM_EMAIL || "Goodson <onboarding@resend.dev>";
  const details = {
    name: row.name,
    email: row.email,
    phone: row.phone,
    plan: getPlan(row.plan)?.name ?? row.plan,
    term: termLabel(row.term),
    amount: formatAmount(row.amount, row.currency),
    paymentId,
  };
  const jobs = [resend.emails.send({ from, to: row.email, ...paymentReceivedEmail(details) })];
  if (process.env.NOTIFY_EMAIL) {
    jobs.push(resend.emails.send({ from, to: process.env.NOTIFY_EMAIL, ...paymentNotificationEmail(details) }));
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("Payment email failed:", r.reason));
}

export async function markFailed(orderId: string, paymentId: string) {
  const db = createAdminClient();
  if (!db) return;
  await db
    .from("payments")
    .update({ status: "failed", razorpay_payment_id: paymentId })
    .eq("razorpay_order_id", orderId)
    .eq("status", "created");
}

export function formatAmount(amount: number, currency: string) {
  const major = amount / 100;
  if (currency === "INR") return `₹${major.toLocaleString("en-IN")}`;
  if (currency === "USD") return `$${major.toLocaleString("en-US")}`;
  return `${currency} ${major}`;
}
