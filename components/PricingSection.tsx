"use client";

import { useEffect, useState } from "react";

type BillingCycle = "monthly" | "annual";
type CurrencyCode = "USD" | "GBP" | "CAD" | "AUD" | "NZD";

const CURRENCIES: { code: CurrencyCode; symbol: string }[] = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "CA$" },
  { code: "AUD", symbol: "A$" },
  { code: "NZD", symbol: "NZ$" },
];

const PLANS = [
  {
    id: "companion",
    name: "Companion",
    monthly: 59,
    annual: 637,
    tagline: "Remote support and peace of mind",
    features: [
      "Weekly wellbeing check-in calls",
      "Family update summaries",
      "Medication & appointment reminders",
      "WhatsApp support line",
    ],
    note: "Remote / light-touch support - no home visits, escorts, or government paperwork.",
    featured: false,
  },
  {
    id: "guardian",
    name: "Guardian",
    monthly: 99,
    annual: 1069,
    tagline: "Hands-on help, on the ground",
    features: [
      "Everything in Companion",
      "In-person visits & escorts",
      "Home repairs & maintenance coordination",
      "Banking & government errands",
    ],
    note: "Unlocks escorts, home repairs, and banking support.",
    featured: true,
  },
  {
    id: "prestige",
    name: "Prestige",
    monthly: 139,
    annual: 1501,
    tagline: "A dedicated concierge, always on",
    features: [
      "Everything in Guardian",
      "Unlimited requests",
      "Dedicated senior concierge",
      "Priority medical coordination",
    ],
    note: "Unlimited support with one dedicated point of contact.",
    featured: false,
  },
] as const;

export default function PricingSection({
  onSelectPlan,
}: {
  onSelectPlan: (plan: string, cycle: BillingCycle) => void;
}) {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
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

  function convert(usd: number) {
    if (currency === "USD" || !rates?.[currency]) return usd;
    return usd * rates[currency];
  }

  function formatPrice(usd: number) {
    const converted = convert(usd);
    const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";
    const decimals = converted % 1 === 0 ? 0 : 2;
    return `${symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  }

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
          <div className="inline-flex rounded-full border border-line bg-paper p-1">
            {(["monthly", "annual"] as BillingCycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  cycle === c
                    ? "bg-ink text-paper"
                    : "text-slate hover:text-ink"
                }`}
              >
                {c === "monthly" ? "Monthly" : "Annual · save 10%"}
              </button>
            ))}
          </div>

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
                  {formatPrice(cycle === "monthly" ? plan.monthly : plan.annual)}
                </span>
                <span
                  className={plan.featured ? "text-slate-dark" : "text-slate"}
                >
                  /{cycle === "monthly" ? "mo" : "yr"}
                </span>
              </div>

              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span
                      className={
                        plan.featured ? "text-marigold" : "text-marigold-deep"
                      }
                    >
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <p
                className={`mt-6 text-xs ${
                  plan.featured ? "text-slate-dark" : "text-slate"
                }`}
              >
                {plan.note}
              </p>

              <button
                onClick={() => onSelectPlan(plan.id, cycle)}
                className={`mt-8 rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                  plan.featured
                    ? "bg-marigold text-ink"
                    : "bg-ink text-paper"
                }`}
              >
                Get started
              </button>
            </div>
          ))}
        </div>

        {!rates && (
          <p className="mt-4 text-xs text-slate">
            Prices shown in USD. Live currency conversion loads shortly.
          </p>
        )}
      </div>
    </section>
  );
}
