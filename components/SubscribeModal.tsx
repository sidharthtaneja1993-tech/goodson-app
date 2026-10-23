"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import {
  PLANS,
  TERMS,
  formatMoney,
  getPlan,
  getTerm,
  termTotalUSD,
  renewEvery,
  type CurrencyCode,
  type PlanId,
  type TermId,
} from "@/lib/plans";

type Step = "plan" | "term" | "details" | "done" | "paid";

type RazorpayResponse = {
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type Billing = "auto" | "once";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function SubscribeModal({
  open,
  onClose,
  initialPlan,
  currency,
  rate,
}: {
  open: boolean;
  onClose: () => void;
  initialPlan: PlanId | null;
  currency: CurrencyCode;
  rate: number | null;
}) {
  const [step, setStep] = useState<Step>("plan");
  const [planId, setPlanId] = useState<PlanId | null>(null);
  const [termId, setTermId] = useState<TermId>("1_month");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "submitting" | "paying" | "error">("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [paidDisplay, setPaidDisplay] = useState<string>("");
  const [billing, setBilling] = useState<Billing>("auto");
  const [paidAuto, setPaidAuto] = useState(false);

  useEffect(() => {
    // Reset the flow each time the popup opens. If a plan card was clicked,
    // skip straight to choosing the subscription length.
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlanId(initialPlan);
      setTermId("1_month");
      setStep(initialPlan ? "term" : "plan");
      setState("idle");
      setNotice(null);
      setBilling("auto");
    }
  }, [open, initialPlan]);

  if (!open) return null;

  const plan = getPlan(planId);
  const term = getTerm(termId)!;
  const money = (usd: number) => formatMoney(usd, currency, rate);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!plan) return;
    setState("submitting");
    setNotice(null);
    try {
      // 1. Save the request (so we have their details even if they don't pay).
      const lead = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: plan.id,
          billing_cycle: term.id,
          amount_usd: termTotalUSD(plan.monthly, term),
        }),
      });
      if (!lead.ok) throw new Error("failed");

      const details = {
        plan: plan.id,
        term: term.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        pincode: form.pincode,
      };
      const post = (url: string, body: unknown) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

      // 2a. Auto-renew: create a Razorpay subscription on the server.
      let mode: Billing = billing;
      let checkout: Record<string, unknown> | null = null;
      let display = "";
      if (mode === "auto") {
        const subRes = await post("/api/razorpay/subscription", details);
        if (subRes.status === 503) {
          mode = "once"; // auto-renew not switched on yet - quietly pay once instead
        } else {
          const sub = await subRes.json();
          if (!subRes.ok) {
            setBilling("once");
            setState("idle");
            setNotice(
              "Automatic renewal isn't available for this plan right now. We've switched you to \"Pay once\" - just tap the button again."
            );
            return;
          }
          checkout = { key: sub.keyId, subscription_id: sub.subscriptionId, notes: sub.notes };
          display = sub.display;
        }
      }

      // 2b. Pay once: create a one-time Razorpay order on the server.
      if (mode === "once") {
        const orderRes = await post("/api/razorpay/order", details);
        if (orderRes.status === 503) {
          // Payments not switched on yet: fall back to "we'll send you a link".
          setStep("done");
          setState("idle");
          return;
        }
        const order = await orderRes.json();
        if (!orderRes.ok) throw new Error(order?.error || "order failed");
        checkout = {
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          notes: order.notes,
        };
        display = order.display;
      }

      // 3. Open Razorpay Checkout.
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("checkout failed to load");

      setState("paying");
      const rzp = new window.Razorpay({
        ...checkout,
        name: "Goodson",
        description:
          mode === "auto" ? `${plan.name} · renews every ${renewEvery(term.id)}` : `${plan.name} · ${term.label}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#3A2E22" },
        handler: async (resp: RazorpayResponse) => {
          setState("submitting");
          const v = await post(
            mode === "auto" ? "/api/razorpay/subscription/verify" : "/api/razorpay/verify",
            resp
          );
          if (v.ok) {
            setPaidDisplay(display);
            setPaidAuto(mode === "auto");
            setStep("paid");
            setState("idle");
          } else {
            setState("error");
            setNotice(
              "We couldn't confirm your payment automatically. If money was deducted, don't worry - message us on WhatsApp and we'll sort it out right away."
            );
          }
        },
        modal: {
          ondismiss: () => {
            setState("idle");
            setNotice(
              mode === "auto"
                ? "Payment wasn't completed. If your card doesn't support automatic renewals, choose \"Pay once\" and try again."
                : "Payment wasn't completed. You can try again, or message us on WhatsApp for help."
            );
          },
        },
      });
      rzp.open();
    } catch {
      setState("error");
      setNotice("Something went wrong - please try again, or message us on WhatsApp.");
    }
  }

  const input =
    "w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep";
  const label = "mb-1 block text-xs uppercase tracking-wide text-slate";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-paper p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-ink">
              {step === "plan" && "Choose your plan"}
              {step === "term" && "How long would you like to subscribe?"}
              {step === "details" && "Your details"}
              {step === "done" && "Thank you"}
              {step === "paid" && "Welcome to Goodson"}
            </h3>
            {plan && step !== "plan" && (
              <p className="mt-1 text-sm text-slate">
                {plan.name}
                {step !== "term" && <> · {term.label} · {money(termTotalUSD(plan.monthly, term))}</>}
              </p>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate hover:text-ink">
            ✕
          </button>
        </div>

        {/* Step 1: plan (only when opened from a general "Subscribe now" button) */}
        {step === "plan" && (
          <div className="space-y-3">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPlanId(p.id);
                  setStep("term");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-line bg-linen px-4 py-4 text-left transition-colors hover:border-ink"
              >
                <span>
                  <span className="block font-semibold text-ink">
                    {p.name}
                    {p.featured && (
                      <span className="ml-2 rounded-full bg-marigold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
                        Most chosen
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-slate">{p.tagline}</span>
                </span>
                <span className="text-sm font-semibold text-ink">{money(p.monthly)}/mo</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: subscription length */}
        {step === "term" && plan && (
          <div>
            <div className="space-y-3">
              {TERMS.map((t) => {
                const total = termTotalUSD(plan.monthly, t);
                const perMonth = total / t.months;
                const selected = t.id === termId;
                return (
                  <label
                    key={t.id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 transition-colors ${
                      selected ? "border-ink bg-linen" : "border-line hover:border-slate"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="term"
                        checked={selected}
                        onChange={() => setTermId(t.id)}
                        className="accent-[#3A2E22]"
                      />
                      <span>
                        <span className="block font-semibold text-ink">{t.label}</span>
                        <span className="block text-xs text-slate">
                          {money(Math.round(perMonth))}/mo
                          {t.discount > 0 && (
                            <span className="ml-2 rounded bg-go-soft px-1.5 py-0.5 font-semibold text-go">
                              Save {Math.round(t.discount * 100)}%
                            </span>
                          )}
                        </span>
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-semibold text-ink">{money(total)}</span>
                      <span className="block text-[11px] text-slate">total</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex items-center justify-between">
              {!initialPlan ? (
                <button onClick={() => setStep("plan")} className="text-sm text-slate hover:text-ink">
                  ← Change plan
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={() => setStep("details")}
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: contact details */}
        {step === "details" && plan && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={label}>Your name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className={label}>WhatsApp number</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555 000 0000"
                className={input}
              />
            </div>
            <div>
              <label className={label}>Parents&apos; PIN code</label>
              <input
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className={input}
              />
            </div>
            <div>
              <label className={label}>Anything we should know? (optional)</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className={input}
              />
            </div>

            <fieldset className="space-y-2">
              <legend className={label}>How would you like to pay?</legend>
              {([
                ["auto", "Renew automatically", `Charged every ${renewEvery(term.id)}. Cancel anytime on WhatsApp.`, "Recommended"],
                ["once", "Pay once", `Covers ${term.label}. We'll remind you before it ends.`, ""],
              ] as [Billing, string, string, string][]).map(([value, title, sub, badge]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    billing === value ? "border-ink bg-linen" : "border-line hover:border-slate"
                  }`}
                >
                  <input
                    type="radio"
                    name="billing"
                    checked={billing === value}
                    onChange={() => setBilling(value)}
                    className="mt-1 accent-[#3A2E22]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {title}
                      {badge && (
                        <span className="ml-2 rounded bg-go-soft px-1.5 py-0.5 text-[11px] font-semibold text-go">
                          {badge}
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-slate">{sub}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            {notice && (
              <p className={`rounded-lg px-3 py-2 text-sm ${state === "error" ? "bg-alert-soft text-alert" : "bg-linen text-ink"}`}>
                {notice}
              </p>
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep("term")}
                className="text-sm text-slate hover:text-ink"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={state === "submitting" || state === "paying"}
                className="flex-1 rounded-full bg-ink py-3 text-sm font-semibold text-paper hover:opacity-90 disabled:opacity-60"
              >
                {state === "submitting"
                  ? "Please wait…"
                  : state === "paying"
                    ? "Complete payment in the Razorpay window…"
                    : billing === "auto"
                      ? `Subscribe · ${money(termTotalUSD(plan.monthly, term))} every ${renewEvery(term.id)}`
                      : `Pay once · ${money(termTotalUSD(plan.monthly, term))}`}
              </button>
            </div>
            <p className="text-center text-xs text-slate">
              Secure payment by Razorpay.{" "}
              {billing === "auto" ? (
                <>
                  Renews automatically every {renewEvery(term.id)}. We&apos;ll email you a reminder before each
                  renewal, and you can <strong className="text-go">cancel anytime</strong> on WhatsApp.
                </>
              ) : (
                <>
                  One-time payment for {term.label}.{" "}
                  <strong className="text-go">No auto-renewal</strong> - we&apos;ll remind you before your
                  plan ends.
                </>
              )}
            </p>
          </form>
        )}

        {/* Paid */}
        {step === "paid" && plan && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-go-soft text-2xl text-go">
              ✓
            </div>
            <p className="font-display text-xl text-ink">Payment received - thank you, {form.name}.</p>
            <p className="mt-2 text-sm text-slate">
              {plan.name} · {term.label} · {paidDisplay}
              {paidAuto ? ", renews automatically" : ""}. A receipt is on its way to {form.email}.
              We&apos;ll WhatsApp you shortly to book your onboarding call and first visit.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <a
                href={whatsappLink(
                  `Hi Goodson, I just paid for the ${plan.name} plan (${term.label}). My name is ${form.name}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Message us on WhatsApp
              </a>
              <button onClick={onClose} className="text-sm text-slate hover:text-ink">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Step 4: confirmation (only when payments aren't switched on) */}
        {step === "done" && plan && (
          <div className="py-4 text-center">
            <p className="font-display text-xl text-ink">
              Your {plan.name} subscription request is in.
            </p>
            <p className="mt-2 text-sm text-slate">
              We&apos;ll reach out on WhatsApp shortly to confirm your parents&apos; details and
              send your secure payment link for {term.label} (
              {money(termTotalUSD(plan.monthly, term))}).
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <a
                href={whatsappLink(
                  `Hi Goodson, I just subscribed to the ${plan.name} plan for ${term.label}. My name is ${form.name}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Chat with us on WhatsApp
              </a>
              <button onClick={onClose} className="text-sm text-slate hover:text-ink">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
