// Single source of truth for Goodson plans, subscription terms and pricing.
// Change a price or discount here and it updates on the pricing cards,
// the Subscribe popup and the emails.

export type PlanId = "companion" | "guardian" | "prestige" | "companion_remote";
export type Region = "ncr" | "remote";
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
    region: "ncr" as Region,
    listMonthly: null as number | null,
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
    region: "ncr" as Region,
    listMonthly: null as number | null,
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
    region: "ncr" as Region,
    listMonthly: null as number | null,
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
  {
    id: "companion_remote" as PlanId,
    region: "remote" as Region,
    listMonthly: 59 as number | null, // regular price, shown crossed out
    name: "Companion Remote",
    monthly: 49, // founding-family price, locked for life
    tagline: "For parents across India*",
    features: [
      "24×7 emergency coordination from our Delhi team",
      "Home visit every 2 months",
      "Setup visit within 2 weeks of joining",
      "Weekly check-in calls in your parents' language",
      "WhatsApp update after every call",
      "Medication & appointment reminders",
    ],
    note: "Founding-family price, locked for life. On-ground escorts and errands are not included outside Delhi NCR.",
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
/** Display name for a stored plan id, e.g. "companion_remote" -> "Companion Remote". */
export function planName(id: string | null | undefined) {
  if (!id) return "";
  return getPlan(id)?.name ?? id;
}

/** "month", "3 months", "6 months" or "year" - for "renews every ..." wording. */
export function renewEvery(termId: string | null | undefined) {
  const months = getTerm(termId)?.months ?? (termId === "annual" ? 12 : 1);
  if (months === 1) return "month";
  if (months === 12) return "year";
  return `${months} months`;
}

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

// One-off extras, booked on WhatsApp and paid by payment link.
export type AddOn = { name: string; detail: string; price: string; where: string };

// Shown under Companion Remote and the remote add-ons.
export const REMOTE_FOOTNOTE =
  "*Some services, such as home visits, lab tests at home and fast emergency support, may be limited or unavailable in remote and rural areas.";

export const ADD_ONS: Record<Region, AddOn[]> = {
  ncr: [
    {
      name: "Extra home visit",
      detail: "An additional visit whenever something feels off.",
      price: "$25",
      where: "All plans",
    },
    {
      name: "Hospital or doctor escort",
      detail: "We take them, stay with them, and send you the doctor's notes.",
      price: "$35",
      where: "Included in Guardian & Prestige",
    },
    {
      name: "Festival or birthday visit",
      detail: "Sweets or flowers you choose, delivered in person, with a photo for you.",
      price: "$35",
      where: "All plans",
    },
    {
      name: "Tech setup for parents",
      detail: "Video calls, bigger text, emergency contacts and scam safety on their phone.",
      price: "$25",
      where: "All plans",
    },
  ],
  remote: [
    {
      name: "Extra home visit",
      detail: "Added to our next scheduled trip to your parents' city.",
      price: "$25",
      where: "Next trip",
    },
    {
      name: "Urgent special trip",
      detail: "When someone needs to be there sooner than the next trip.",
      price: "Travel + $40",
      where: "Quoted on WhatsApp",
    },
    {
      name: "Lab tests at home",
      detail: "We book home sample collection and explain the report to you.",
      price: "$10 + lab cost",
      where: "Most cities*",
    },
    {
      name: "Tech setup for parents",
      detail: "On a visit or by video call: video calling, bigger text, scam safety.",
      price: "$25",
      where: "Across India",
    },
  ],
};
