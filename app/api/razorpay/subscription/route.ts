import { NextRequest, NextResponse } from "next/server";
import { getOrCreatePlanId, priceFor, razorpayConfigured, rzp } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

// Starts an auto-renewing subscription. The browser then opens Razorpay
// Checkout with the returned subscription id for the first payment.
export async function POST(req: NextRequest) {
  const db = createAdminClient();
  if (!razorpayConfigured() || !db) {
    return NextResponse.json({ error: "Auto-renew is not set up yet" }, { status: 503 });
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
    const planId = await getOrCreatePlanId(db, price);
    // Razorpay needs a total number of renewals; we allow up to 5 years.
    const totalCount = Math.max(1, Math.floor(60 / price.term.months));
    const sub = await rzp<{ id: string }>("POST", "/subscriptions", {
      plan_id: planId,
      total_count: totalCount,
      customer_notify: 1,
      notes,
    });

    const { error } = await db.from("subscriptions").insert({
      razorpay_subscription_id: sub.id,
      razorpay_plan_id: planId,
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
    if (error) console.error("Could not record subscription:", error.message);

    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      subscriptionId: sub.id,
      display: price.display,
      notes,
    });
  } catch (e) {
    console.error("Razorpay subscription failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not start auto-renew" },
      { status: 502 }
    );
  }
}
