"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import {
  CURRENCIES,
  PLANS,
  ADD_ONS,
  REMOTE_FOOTNOTE,
  type Region,
  MAX_DISCOUNT,
  formatMoney,
  currencyForCountry,
  isCurrency,
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
  const [region, setRegion] = useState<Region>("ncr");

  useEffect(() => {
    // The PIN checker sends visitors here with "remote" selected.
    const onRegion = (e: Event) => setRegion((e as CustomEvent<Region>).detail);
    window.addEventListener("goodson:region", onRegion);
    return () => window.removeEventListener("goodson:region", onRegion);
  }, []);

  // Show prices in the visitor's own currency: their earlier choice if they
  // made one, otherwise the currency of the country they're browsing from.
  useEffect(() => {
    let cancelled = false;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("goodson:currency");
    } catch {}
    if (isCurrency(saved)) {
      const choice = saved;
      queueMicrotask(() => {
        if (!cancelled) setCurrency(choice);
      });
      return () => {
        cancelled = true;
      };
    }
    const fromLanguage = () => {
      const region = (navigator.language || "").split("-")[1];
      return currencyForCountry(region);
    };
    fetch("/api/geo")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setCurrency(data?.country ? currencyForCountry(data.country) : fromLanguage());
      })
      .catch(() => {
        if (!cancelled) setCurrency(fromLanguage());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function chooseCurrency(code: CurrencyCode) {
    setCurrency(code);
    try {
      localStorage.setItem("goodson:currency", code);
    } catch {}
  }

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

        <div className="mt-10">
          <p className="mb-3 text-sm font-semibold text-ink">Where do your parents live?</p>
          <div className="inline-flex flex-wrap rounded-2xl border border-line bg-paper p-1">
            {([
              ["ncr", "Delhi NCR"],
              ["remote", "Elsewhere in India"],
            ] as [Region, string][]).map(([r, label]) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                  region === r ? "bg-ink text-paper" : "text-slate hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <p className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-slate">
            Subscribe for 1, 3, 6 or 12 months ·{" "}
            <span className="font-semibold text-go">
              save up to {Math.round(MAX_DISCOUNT * 100)}%
            </span>{" "}
            on longer terms
          </p>
          <p className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-slate">
            <span className="font-semibold text-go">Onboarding within 3 days</span> of subscribing
          </p>
          <p className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-slate">
            <span className="font-semibold text-go">Covers both parents</span> at the same address
          </p>

          <label className="ml-auto flex items-center gap-2 text-sm text-slate">
            Show prices in
            <select
              value={currency}
              onChange={(e) => chooseCurrency(e.target.value as CurrencyCode)}
              className="rounded-md border border-line bg-paper px-2 py-1.5 text-charcoal"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} · {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {currency !== "USD" && rate && (
          <p className="mt-3 text-right text-xs text-slate">
            Prices in {currency} are approximate. You&apos;re billed in US dollars, and your bank converts at its own rate.
          </p>
        )}

        <div className={`mt-10 grid gap-6 ${region === "ncr" ? "md:grid-cols-3" : "md:grid-cols-[1.2fr_1fr]"}`}>
          {PLANS.filter((p) => p.region === region).map((plan) => (
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
              {plan.listMonthly && (
                <span className="mb-4 w-fit rounded-full bg-go-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-go">
                  Founding families · limited spots
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
                {plan.listMonthly && (
                  <span className="mr-2 text-xl text-slate line-through">
                    {formatMoney(plan.listMonthly, currency, rate)}
                  </span>
                )}
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
          {region === "remote" && (
            <div className="flex flex-col justify-between rounded-2xl border border-dashed border-line bg-paper/60 p-8">
              <div>
                <span className="w-fit rounded-full bg-linen px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate">
                  Coming to more cities
                </span>
                <h3 className="font-display mt-4 text-2xl text-ink">Guardian &amp; Prestige</h3>
                <p className="mt-2 text-sm text-slate">
                  Regular visits, escorts, errands and a dedicated concierge are available in Delhi NCR
                  today. We open new cities where families ask for us. Start with Companion Remote and
                  you&apos;ll be first to upgrade when we launch near your parents.
                </p>
              </div>
              <a
                href={whatsappLink("Hi Goodson, please let me know when Guardian is available in my parents' city.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-fit rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-ink"
              >
                Tell me when it&apos;s in my city
              </a>
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate">Add-ons</p>
              <h3 className="font-display mt-1 text-2xl text-ink">Extra help, only when you need it</h3>
            </div>
            <a
              href={whatsappLink("Hi Goodson, I'd like to book an add-on for my parents.")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-go hover:underline"
            >
              Book an add-on on WhatsApp →
            </a>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ADD_ONS[region].map((a) => (
              <div key={a.name} className="flex flex-col rounded-xl bg-linen p-4">
                <p className="text-sm font-semibold text-ink">{a.name}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-slate">{a.detail}</p>
                <p className="mt-3 text-sm">
                  <span className="font-display text-xl text-go">{a.price}</span>
                  <span className="text-xs text-slate"> · {a.where}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {region === "remote" && (
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate">{REMOTE_FOOTNOTE}</p>
        )}
      </div>
    </section>
  );
}
