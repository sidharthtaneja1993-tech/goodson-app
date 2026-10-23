import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { markPaid } from "@/lib/payments";
import { ensureIntake } from "@/lib/onboarding";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
  ) {
    return NextResponse.json({ error: "Payment could not be verified" }, { status: 400 });
  }

  await markPaid(razorpay_order_id, razorpay_payment_id);

  // Private link for the parents' details form, shown on the success screen.
  let onboardingToken: string | null = null;
  const db = createAdminClient();
  if (db) {
    const { data: row } = await db
      .from("payments")
      .select("name, email, phone, plan, term")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();
    if (row) onboardingToken = await ensureIntake({ ref: razorpay_order_id, ...row });
  }
  return NextResponse.json({ ok: true, onboardingToken });
}
