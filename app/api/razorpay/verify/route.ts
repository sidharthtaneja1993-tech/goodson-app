import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { markPaid } from "@/lib/payments";

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
  return NextResponse.json({ ok: true });
}
