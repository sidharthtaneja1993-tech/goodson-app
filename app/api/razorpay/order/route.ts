import { NextRequest, NextResponse } from "next/server";
import { createOrder, priceFor, razorpayConfigured } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  if (!razorpayConfigured()) {
    return NextResponse.json({ error: "Payments are not set up yet" }, { status: 503 });
  }

  const { plan, term, name, email, phone, pincode } = await req.json();
  const price = priceFor(plan, term);
  if (!price || !name || !email || !phone) {
    return NextResponse.json({ error: "Missing or invalid details" }, { status: 400 });
  }

  const notes = {
    plan: price.plan.id,
    term: price.term.id,
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    phone: String(phone).slice(0, 50),
    pincode: String(pincode || "").slice(0, 10),
  };

  try {
    const order = await createOrder({
      amount: price.amount,
      currency: price.currency,
      receipt: `gs_${Date.now()}`,
      notes,
    });

    // Record the attempt so it shows in /admin even if the customer abandons checkout.
    const db = createAdminClient();
    if (db) {
      const { error } = await db.from("payments").insert({
        razorpay_order_id: order.id,
        status: "created",
        plan: price.plan.id,
        term: price.term.id,
        amount: price.amount,
        currency: price.currency,
        amount_usd: price.usd,
        name: notes.name,
        email: notes.email,
        phone: notes.phone,
        pincode: notes.pincode || null,
      });
      if (error) console.error("Could not record payment attempt:", error.message);
    }

    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      display: price.display,
      notes,
    });
  } catch (e) {
    console.error("Razorpay order failed:", e);
    return NextResponse.json({ error: "Could not start payment" }, { status: 502 });
  }
}
