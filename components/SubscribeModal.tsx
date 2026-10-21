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
  type CurrencyCode,
  type PlanId,
  type TermId,
} from "@/lib/plans";

type Step = "plan" | "term" | "details" | "done";

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
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");

  useEffect(() => {
    // Reset the flow each time the popup opens. If a plan card was clicked,
    // skip straight to choosing the subscription length.
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlanId(initialPlan);
      setTermId("1_month");
      setStep(initialPlan ? "term" : "plan");
      setState("idle");
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
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: plan.id,
          billing_cycle: term.id,
          amount_usd: termTotalUSD(plan.monthly, term),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStep("done");
      setState("idle");
    } catch {
      setState("error");
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
                            <span className="ml-2 font-semibold text-marigold-deep">
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

            {state === "error" && (
              <p className="text-sm text-rose-ash">Something went wrong - please try again.</p>
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
                disabled={state === "submitting"}
                className="flex-1 rounded-full bg-ink py-3 text-sm font-semibold text-paper hover:opacity-90 disabled:opacity-60"
              >
                {state === "submitting"
                  ? "Submitting…"
                  : `Subscribe · ${money(termTotalUSD(plan.monthly, term))}`}
              </button>
            </div>
            <p className="text-center text-xs text-slate">
              No payment taken now. We&apos;ll confirm your parents&apos; details and send a
              secure payment link on WhatsApp.
            </p>
          </form>
        )}

        {/* Step 4: confirmation */}
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
