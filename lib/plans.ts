// Single source of truth for Goodson plans, subscription terms and pricing.
// Change a price or discount here and it updates on the pricing cards,
// the Subscribe popup and the emails.

export type PlanId = "companion" | "guardian" | "prestige";
export type TermId = "1_month" | "3_months" | "6_months" | "12_months";
export type CurrencyCode = "USD" | "GBP" | "CAD" | "AUD" | "NZD" | "INR";

export const CURRENCIES: { code: CurrencyCode; symbol: string }[] = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "CA$" },
  { code: "AUD", symbol: "A$" },
  { code: "NZD", symbol: "NZ$" },
  { code: "INR", symbol: "₹" },
];

export const PLANS = [
  {
    id: "companion" as PlanId,
    name: "Companion",
    monthly: 59, // USD per month
    tagline: "Remote support and peace of mind",
    features: [
      "24×7 emergency response & hospital coordination",
      "Weekly wellbeing check-in calls",
      "Family update summaries",
      "Medication & appointment reminders",
      "WhatsApp support line",
    ],
    note: "Remote / light-touch support - no home visits, escorts, or government paperwork.",
    featured: false,
  },
  {
    id: "guardian" as PlanId,
    name: "Guardian",
    monthly: 99,
    tagline: "Hands-on help, on the ground",
    features: [
      "24×7 emergency response & hospital coordination",
      "Everything in Companion",
      "In-person visits & escorts",
      "Home repairs & maintenance coordination",
      "Banking & government errands",
    ],
    note: "Unlocks escorts, home repairs, and banking support.",
    featured: true,
  },
  {
    id: "prestige" as PlanId,
    name: "Prestige",
    monthly: 139,
    tagline: "A dedicated concierge, always on",
    features: [
      "24×7 emergency response & hospital coordination",
      "Everything in Guardian",
      "Unlimited requests",
      "Dedicated senior concierge",
      "Priority medical coordination",
    ],
    note: "Unlimited support with one dedicated point of contact.",
    featured: false,
  },
];

// Subscription lengths offered in the Subscribe popup.
// `discount` is a fraction off the monthly price (0.1 = 10% off).
export const TERMS: { id: TermId; label: string; months: number; discount: number }[] = [
  { id: "1_month", label: "1 month", months: 1, discount: 0 },
  { id: "3_months", label: "3 months", months: 3, discount: 0.05 },
  { id: "6_months", label: "6 months", months: 6, discount: 0.08 },
  { id: "12_months", label: "Annual (12 months)", months: 12, discount: 0.1 },
];

export const MAX_DISCOUNT = Math.max(...TERMS.map((t) => t.discount));

export function getPlan(id: string | null | undefined) {
  return PLANS.find((p) => p.id === id) ?? null;
}

export function getTerm(id: string | null | undefined) {
  return TERMS.find((t) => t.id === id) ?? null;
}

/** Total USD price for a plan over a term, rounded to whole dollars. */
export function termTotalUSD(planMonthly: number, term: { months: number; discount: number }) {
  return Math.round(planMonthly * term.months * (1 - term.discount));
}

/** Human label for a stored term/billing value, incl. older "monthly"/"annual" rows. */
export function termLabel(value: string | null | undefined) {
  if (!value) return "";
  if (value === "monthly") return "1 month";
  if (value === "annual") return "Annual (12 months)";
  return getTerm(value)?.label ?? value;
}

export function formatMoney(usd: number, currency: CurrencyCode, rate: number | null) {
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$";
  const converted = currency === "USD" || !rate ? usd : usd * rate;
  const shownSymbol = currency !== "USD" && !rate ? "$" : symbol;
  if (currency === "INR" && rate) {
    return `${symbol}${Math.round(converted).toLocaleString("en-IN")}`;
  }
  const decimals = converted % 1 === 0 ? 0 : 2;
  return `${shownSymbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
