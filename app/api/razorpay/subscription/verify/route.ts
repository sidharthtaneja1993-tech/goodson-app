import { NextRequest, NextResponse } from "next/server";
import { rzp, verifySubscriptionSignature } from "@/lib/razorpay";
import { recordCharge, type RzpPayment, type RzpSubscription } from "@/lib/subscriptions";
import { ensureIntake } from "@/lib/onboarding";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = await req.json();

  if (
    !razorpay_payment_id ||
    !razorpay_subscription_id ||
    !razorpay_signature ||
    !verifySubscriptionSignature(razorpay_payment_id, razorpay_subscription_id, razorpay_signature)
  ) {
    return NextResponse.json({ error: "Payment could not be verified" }, { status: 400 });
  }

  // Signature is genuine - fetch the latest details from Razorpay and record them.
  // (The webhook does the same; whichever arrives first wins, the other is a no-op.)
  try {
    const [sub, payment] = await Promise.all([
      rzp<RzpSubscription>("GET", `/subscriptions/${razorpay_subscription_id}`),
      rzp<RzpPayment>("GET", `/payments/${razorpay_payment_id}`),
    ]);
    await recordCharge(sub, payment);
  } catch (e) {
    console.error("Could not record subscription charge (webhook will retry):", e);
  }

  // Private link for the parents' details form, shown on the success screen.
  let onboardingToken: string | null = null;
  const db = createAdminClient();
  if (db) {
    const { data: row } = await db
      .from("subscriptions")
      .select("name, email, phone, plan, term")
      .eq("razorpay_subscription_id", razorpay_subscription_id)
      .maybeSingle();
    if (row) onboardingToken = await ensureIntake({ ref: razorpay_subscription_id, ...row });
  }
  return NextResponse.json({ ok: true, onboardingToken });
}
