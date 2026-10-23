import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { markPaid, markFailed } from "@/lib/payments";
import { recordCharge, updateStatus } from "@/lib/subscriptions";

// Razorpay calls this for one-time payments and for every subscription event,
// including automatic renewals. Set it up in Razorpay Dashboard > Webhooks.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const type: string = event?.event || "";
  const payment = event?.payload?.payment?.entity;
  const sub = event?.payload?.subscription?.entity;

  // Auto-renewing subscriptions
  if (type.startsWith("subscription.") && sub?.id) {
    if (type === "subscription.charged" && payment?.id) {
      await recordCharge(sub, payment);
    } else {
      const status = type.replace("subscription.", ""); // activated, pending, halted, cancelled, completed ...
      await updateStatus(sub, status === "activated" || status === "resumed" ? "active" : status);
    }
    return NextResponse.json({ ok: true });
  }

  // One-time payments
  if (payment?.order_id) {
    if (type === "payment.captured" || type === "order.paid") {
      await markPaid(payment.order_id, payment.id);
    } else if (type === "payment.failed") {
      await markFailed(payment.order_id, payment.id);
    }
  }

  return NextResponse.json({ ok: true });
}
