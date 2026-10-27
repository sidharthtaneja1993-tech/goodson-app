// Single source of truth for Goodson plans, subscription terms and pricing.
// Change a price or discount here and it updates on the pricing cards,
// the Subscribe popup and the emails.

export type PlanId = "companion" | "guardian" | "prestige" | "companion_remote";
export type Region = "ncr" | "remote";
export type TermId = "1_month" | "3_months" | "6_months" | "12_months";
export type CurrencyCode =
  | "USD" | "GBP" | "EUR" | "CAD" | "AUD" | "NZD" | "AED" | "SAR" | "QAR" | "KWD"
  | "OMR" | "BHD" | "SGD" | "HKD" | "MYR" | "JPY" | "CHF" | "INR";

// Prices are set and charged in USD; other currencies are shown as an estimate.
export const CURRENCIES: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: "USD", symbol: "$", name: "US dollar" },
  { code: "GBP", symbol: "£", name: "British pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "CAD", symbol: "CA$", name: "Canadian dollar" },
  { code: "AUD", symbol: "A$", name: "Australian dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand dollar" },
  { code: "AED", symbol: "AED ", name: "UAE dirham" },
  { code: "SAR", symbol: "SAR ", name: "Saudi riyal" },
  { code: "QAR", symbol: "QAR ", name: "Qatari riyal" },
  { code: "KWD", symbol: "KWD ", name: "Kuwaiti dinar" },
  { code: "OMR", symbol: "OMR ", name: "Omani rial" },
  { code: "BHD", symbol: "BHD ", name: "Bahraini dinar" },
  { code: "SGD", symbol: "S$", name: "Singapore dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong dollar" },
  { code: "MYR", symbol: "RM", name: "Malaysian ringgit" },
  { code: "JPY", symbol: "¥", name: "Japanese yen" },
  { code: "CHF", symbol: "CHF ", name: "Swiss franc" },
  { code: "INR", symbol: "₹", name: "Indian rupee" },
];

const EURO_COUNTRIES = [
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU",
  "MT", "NL", "PT", "SK", "SI", "ES",
];
const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  US: "USD", GB: "GBP", CA: "CAD", AU: "AUD", NZ: "NZD", AE: "AED", SA: "SAR",
  QA: "QAR", KW: "KWD", OM: "OMR", BH: "BHD", SG: "SGD", HK: "HKD", MY: "MYR",
  JP: "JPY", CH: "CHF", IN: "INR",
  ...Object.fromEntries(EURO_COUNTRIES.map((c) => [c, "EUR" as CurrencyCode])),
};

/** Currency to show a visitor from this country (2-letter code), or USD. */
export function currencyForCountry(country: string | null | undefined): CurrencyCode {
  return (country && COUNTRY_CURRENCY[country.toUpperCase()]) || "USD";
}

export function isCurrency(code: string | null | undefined): code is CurrencyCode {
  return CURRENCIES.some((c) => c.code === code);
}

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
  // No exchange rate yet (or USD): show the real USD price.
  if (currency === "USD" || !rate) {
    const decimals = usd % 1 === 0 ? 0 : 2;
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency + " ";
  // Converted prices are estimates, so whole numbers read better than £46.53.
  const converted = Math.round(usd * rate);
  return `${symbol}${converted.toLocaleString(currency === "INR" ? "en-IN" : "en-US")}`;
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
