import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Goodson Keys — Property care in Delhi NCR for families abroad",
  description:
    "Your flat or house in Delhi NCR, looked after while you're abroad: regular inspections with photos, bills paid, tenants found and managed, repairs handled.",
};

const PLANS = [
  {
    name: "Empty Home",
    price: "$29",
    per: "/mo",
    tagline: "For a flat or house no one lives in",
    features: [
      "Monthly visit with photos and a WhatsApp report",
      "Air out, run taps, check for leaks, damp and pests",
      "Society maintenance, electricity and water bills tracked and paid",
      "Security check: locks, meters, signs of entry",
      "Cleaning arranged before you visit India",
    ],
    featured: false,
  },
  {
    name: "Rented Home",
    price: "$49",
    per: "/mo",
    tagline: "For a property with a tenant",
    features: [
      "Rent tracked every month, with polite follow-up if it's late",
      "We're the tenant's local contact for complaints and repairs",
      "Inspection with photos every 3 months",
      "Rent agreement renewals and police verification handled",
      "Monthly statement: rent received, bills paid, work done",
    ],
    featured: true,
  },
  {
    name: "Tenant Finder",
    price: "50%",
    per: " of 1 month's rent, once",
    tagline: "When your property needs a new tenant",
    features: [
      "Photos and listing on the main rental sites",
      "Showings handled by us, you approve the shortlist",
      "Tenant background and police verification",
      "Registered rent agreement arranged",
      "Move-in checklist with dated photos of every room",
    ],
    featured: false,
  },
];

const EXTRAS = [
  ["Repairs & maintenance", "Plumber, electrician, carpenter, painting, pest control. Quotes sent to you first.", "Cost + 15%"],
  ["Move-out inspection", "Room-by-room check against move-in photos, to settle the deposit fairly.", "$35"],
  ["Deep clean", "Before a new tenant moves in, or before you come home.", "Cost + 15%"],
  ["Property tax & paperwork", "Property tax paid on time; society NOCs and documents collected.", "From $25"],
];

const FAQS = [
  [
    "Do you collect the rent?",
    "No. Rent goes straight from the tenant to your bank account, so your money never passes through us. We track it every month and follow up if it's late.",
  ],
  [
    "Who holds the keys?",
    "One named Goodson team member. Every visit is logged with the date, time and photos, and keys are never given to anyone without your approval on WhatsApp.",
  ],
  [
    "What about tax on rent?",
    "Rent paid to NRIs has special tax rules (tenants usually have to deduct TDS). We make sure your tenant knows and we coordinate with your CA, but we don't give tax advice.",
  ],
  [
    "Which areas do you cover?",
    "Delhi, Gurugram, Noida, Ghaziabad and Faridabad. Message us with your property's location if you're not sure.",
  ],
  [
    "What if there's a dispute with a tenant?",
    "We handle everyday issues and keep a record of everything. If something needs legal action, we'll connect you with a lawyer and support them with the records.",
  ],
];

export default function KeysPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linen px-6 pb-20 pt-40 sm:px-10 sm:pt-48">
        <Header variant="keys" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-marigold" />
              <span className="font-mono text-xs uppercase tracking-widest text-slate">
                Goodson Keys · Property care in Delhi NCR
              </span>
            </div>
            <h1 className="font-display max-w-xl text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Your home in India. Your keys, in safe hands.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Empty or rented, your flat or house gets regular visits, photos on WhatsApp, bills paid on
              time and tenants handled properly, by the same trusted team that cares for parents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              {["Visits with dated photos", "Rent never passes through us", "One named contact for your property"].map((t) => (
                <span key={t} className="rounded-full border border-line bg-paper px-4 py-2 text-slate">
                  <span className="mr-1 text-go">✓</span>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsappLink("Hi Goodson, I'd like to know more about Goodson Keys for my property in Delhi NCR.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-marigold px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-marigold/20"
              >
                Talk to us on WhatsApp
              </a>
              <a
                href="#home-plans"
                className="rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
              >
                See plans
              </a>
            </div>
          </div>

          {/* Sample property report */}
          <div className="rounded-3xl bg-[#ECE5DD] p-4 shadow-xl sm:p-5">
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-[#075E54] px-4 py-3 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">G</span>
              <div>
                <p className="text-sm font-semibold">Goodson Keys</p>
                <p className="text-[11px] text-white/80">Flat B-1204, Sector 54, Gurugram</p>
              </div>
            </div>
            <div className="max-w-[92%] rounded-xl rounded-tl-sm bg-white p-3 text-[13px] leading-snug text-[#111] shadow-sm">
              <p className="mb-2 font-semibold">🏠 Monthly visit · 12 Oct</p>
              <div className="mb-2 grid grid-cols-3 gap-1.5">
                {[
                  ["Living room", "/images/keys/living-room.jpg"],
                  ["Kitchen", "/images/keys/kitchen.jpg"],
                  ["Bathroom", "/images/keys/bathroom.jpg"],
                ].map(([r, src]) => (
                  <div key={r} className="relative aspect-square overflow-hidden rounded-md bg-[#d8cbb8]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${r} photo from a Goodson Keys visit`} className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[9px] text-white">{r}</span>
                  </div>
                ))}
              </div>
              <p>✅ All rooms clean and dry, no leaks</p>
              <p>✅ Windows opened, taps and geyser run</p>
              <p>✅ Society maintenance paid: ₹4,850</p>
              <p>✅ Electricity bill paid: ₹612</p>
              <p className="mt-1">⚠️ Small damp patch on balcony wall. Plumber quote: ₹1,800. Shall we go ahead?</p>
              <p className="mt-1 text-right text-[11px] text-[#667781]">4:12 PM</p>
            </div>
            <div className="ml-auto mt-2 w-fit max-w-[80%] rounded-xl rounded-tr-sm bg-[#D9FDD3] px-3 py-2 text-[13px] text-[#111] shadow-sm">
              Yes please, go ahead 👍
              <p className="mt-1 text-right text-[11px] text-[#667781]">9:05 PM ✓✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-paper px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["1", "Tell us about your property", "Address, keys, society contacts, and any tenant details. Takes 5 minutes on WhatsApp."],
              ["2", "We do a first visit", "A full walk-through with photos of every room, meters and fittings, so we both have a record."],
              ["3", "Regular updates on WhatsApp", "Visits, bills, rent and repairs, all reported with photos. You approve anything that costs money."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-line bg-linen p-6">
                <span className="font-display text-3xl text-marigold-deep">{n}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="home-plans" className="scroll-mt-8 bg-linen px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-marigold-deep" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate">Goodson Keys plans</span>
          </div>
          <h2 className="font-display max-w-xl text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            Pick what your property needs
          </h2>
          <p className="mt-6 w-fit rounded-full border border-go/30 bg-go-soft px-4 py-2 text-sm text-ink">
            <span className="font-semibold text-go">Already a Goodson family?</span> Get 20% off Goodson Keys.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`flex flex-col rounded-2xl border p-8 ${
                  p.featured ? "border-ink bg-ink text-paper shadow-xl" : "border-line bg-paper text-charcoal"
                }`}
              >
                {p.featured && (
                  <span className="mb-4 w-fit rounded-full bg-marigold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
                    Most chosen
                  </span>
                )}
                <h3 className="font-display text-2xl">{p.name}</h3>
                <p className={`mt-1 text-sm ${p.featured ? "text-slate-dark" : "text-slate"}`}>{p.tagline}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl">{p.price}</span>
                  <span className={p.featured ? "text-slate-dark" : "text-slate"}>{p.per}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className={p.featured ? "text-go-dark" : "text-go"}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappLink(`Hi Goodson, I'm interested in the Goodson Keys "${p.name}" plan for my property.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold hover:opacity-90 ${
                    p.featured ? "bg-marigold text-ink" : "bg-ink text-paper"
                  }`}
                >
                  Get started
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-paper p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-slate">On request</p>
            <h3 className="font-display mt-1 text-2xl text-ink">Extra help for your property</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {EXTRAS.map(([n, d, pr]) => (
                <div key={n} className="flex flex-col rounded-xl bg-linen p-4">
                  <p className="text-sm font-semibold text-ink">{n}</p>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-slate">{d}</p>
                  <p className="font-display mt-3 text-xl text-go">{pr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-8 bg-paper px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">Questions owners ask</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                  {q}
                  <span className="text-slate transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-linen px-6 py-20 text-center sm:px-10">
        <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Parents and property, one trusted team.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate">
          Tell us where your property is and what it needs. We&apos;ll reply on WhatsApp within a day.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={whatsappLink("Hi Goodson, I'd like to know more about Goodson Keys for my property in Delhi NCR.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-marigold px-6 py-3.5 text-sm font-semibold text-ink hover:opacity-90"
          >
            Talk to us on WhatsApp
          </a>
          <Link
            href="/#plans"
            className="rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink hover:border-ink"
          >
            See parent care plans
          </Link>
        </div>
      </section>

      <Footer variant="keys" />
    </main>
  );
}
