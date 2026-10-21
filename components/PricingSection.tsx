"use client";

import { useEffect, useState } from "react";
import {
  CURRENCIES,
  PLANS,
  MAX_DISCOUNT,
  formatMoney,
  type CurrencyCode,
  type PlanId,
} from "@/lib/plans";

export default function PricingSection({
  onSelectPlan,
}: {
  onSelectPlan: (plan: PlanId, currency: CurrencyCode, rate: number | null) => void;
}) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.rates) setRates(data.rates);
      })
      .catch(() => {
        // Fall back silently to USD-only display
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rate = currency === "USD" ? 1 : rates?.[currency] ?? null;

  return (
    <section id="plans" className="bg-linen px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-marigold-deep" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate">
            Plans
          </span>
        </div>
        <h2 className="font-display max-w-xl text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          Choose the level of presence your family needs
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <p className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-slate">
            Subscribe for 1, 3, 6 or 12 months ·{" "}
            <span className="font-semibold text-go">
              save up to {Math.round(MAX_DISCOUNT * 100)}%
            </span>{" "}
            on longer terms
          </p>

          <label className="ml-auto flex items-center gap-2 text-sm text-slate">
            Show prices in
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="rounded-md border border-line bg-paper px-2 py-1.5 text-charcoal"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.featured
                  ? "border-ink bg-ink text-paper shadow-xl"
                  : "border-line bg-paper text-charcoal"
              }`}
            >
              {plan.featured && (
                <span className="mb-4 w-fit rounded-full bg-marigold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
                  Most chosen
                </span>
              )}
              <h3 className="font-display text-2xl">{plan.name}</h3>
              <p
                className={`mt-1 text-sm ${
                  plan.featured ? "text-slate-dark" : "text-slate"
                }`}
              >
                {plan.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl">
                  {formatMoney(plan.monthly, currency, rate)}
                </span>
                <span className={plan.featured ? "text-slate-dark" : "text-slate"}>
                  /mo
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {plan.features.map((f) => {
                  const urgent = f.startsWith("24×7");
                  return (
                    <li key={f} className="flex gap-2">
                      <span
                        className={
                          urgent
                            ? plan.featured ? "text-alert-dark" : "text-alert"
                            : plan.featured ? "text-go-dark" : "text-go"
                        }
                      >
                        {urgent ? "●" : "✓"}
                      </span>
                      <span className={urgent ? "font-semibold" : ""}>{f}</span>
                    </li>
                  );
                })}
              </ul>

              <p
                className={`mt-6 text-xs ${
                  plan.featured ? "text-slate-dark" : "text-slate"
                }`}
              >
                {plan.note}
              </p>

              <button
                onClick={() => onSelectPlan(plan.id, currency, rate)}
                className={`mt-8 rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                  plan.featured ? "bg-marigold text-ink" : "bg-ink text-paper"
                }`}
              >
                Subscribe now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
