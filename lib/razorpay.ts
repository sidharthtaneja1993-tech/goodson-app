import crypto from "crypto";
import { getPlan, getTerm, termTotalUSD } from "@/lib/plans";

// Server-only helpers for Razorpay. Keys come from environment variables:
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
//   RAZORPAY_CURRENCY      "USD" (default) or "INR"
//   RAZORPAY_INR_PER_USD   only used when RAZORPAY_CURRENCY=INR (e.g. 88)

export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/** Works out the charge on the server from plan + term, so the browser can't change the price. */
export function priceFor(planId: string, termId: string) {
  const plan = getPlan(planId);
  const term = getTerm(termId);
  if (!plan || !term) return null;

  const usd = termTotalUSD(plan.monthly, term);
  const currency = (process.env.RAZORPAY_CURRENCY || "USD").toUpperCase();

  if (currency === "INR") {
    const rate = Number(process.env.RAZORPAY_INR_PER_USD || "0");
    if (!rate) return null;
    const inr = Math.round(usd * rate);
    return { plan, term, usd, currency: "INR", amount: inr * 100, display: `₹${inr.toLocaleString("en-IN")}` };
  }

  // Razorpay amounts are in the smallest unit (cents for USD).
  return { plan, term, usd, currency: "USD", amount: usd * 100, display: `$${usd}` };
}

export async function createOrder(params: {
  amount: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}) {
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.description || "Could not create Razorpay order");
  }
  return data as { id: string; amount: number; currency: string };
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** Checks the signature Razorpay Checkout returns after a successful payment. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

/** Checks the X-Razorpay-Signature header on webhook calls. */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}

// ---------------------------------------------------------------------------
// Subscriptions (auto-renewal)
// ---------------------------------------------------------------------------

function authHeader() {
  return (
    "Basic " +
    Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")
  );
}

/** Small wrapper around the Razorpay REST API. Throws with Razorpay's own message on errors. */
export async function rzp<T = Record<string, unknown>>(
  method: "GET" | "POST",
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.description || `Razorpay ${path} failed`);
  return data as T;
}

type Price = NonNullable<ReturnType<typeof priceFor>>;

/**
 * Razorpay needs a "plan" for every price + billing period. We create them
 * on first use and remember the id in the razorpay_plans table.
 */
export async function getOrCreatePlanId(
  db: { from: (t: string) => any }, // eslint-disable-line @typescript-eslint/no-explicit-any
  price: Price
) {
  const key = `${price.plan.id}:${price.term.id}:${price.currency}:${price.amount}`;
  const { data: existing } = await db
    .from("razorpay_plans")
    .select("razorpay_plan_id")
    .eq("key", key)
    .maybeSingle();
  if (existing?.razorpay_plan_id) return existing.razorpay_plan_id as string;

  const plan = await rzp<{ id: string }>("POST", "/plans", {
    period: "monthly",
    interval: price.term.months,
    item: {
      name: `Goodson ${price.plan.name} · ${price.term.label}`,
      amount: price.amount,
      currency: price.currency,
      description: `Renews every ${price.term.label}`,
    },
    notes: { plan: price.plan.id, term: price.term.id },
  });
  await db.from("razorpay_plans").insert({ key, razorpay_plan_id: plan.id });
  return plan.id;
}

/** Checks the signature Razorpay Checkout returns after a subscription's first payment. */
export function verifySubscriptionSignature(paymentId: string, subscriptionId: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}
