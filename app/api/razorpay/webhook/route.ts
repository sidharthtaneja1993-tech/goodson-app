import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { markPaid, markFailed } from "@/lib/payments";

// Backup path: Razorpay calls this even if the customer closes the browser
// right after paying. Set it up in Razorpay Dashboard > Webhooks.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const payment = event?.payload?.payment?.entity;

  if (payment?.order_id) {
    if (event.event === "payment.captured" || event.event === "order.paid") {
      await markPaid(payment.order_id, payment.id);
    } else if (event.event === "payment.failed") {
      await markFailed(payment.order_id, payment.id);
    }
  }

  return NextResponse.json({ ok: true });
}
