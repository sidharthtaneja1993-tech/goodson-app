import Link from "next/link";
import FadeIn from "@/components/FadeIn";

// Homepage teaser for Goodson Keys (property care), linking to /keys.
export default function HomeCareHook() {
  return (
    <section className="bg-linen px-6 pb-16 sm:px-10">
      <FadeIn>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-2xl bg-ink p-6 text-paper shadow-xl sm:p-8 md:flex-row md:justify-between md:gap-10">
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-marigold text-2xl">🔑</span>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate-dark">New · Goodson Keys</p>
              <h3 className="font-display mt-1 text-2xl leading-tight sm:text-3xl">
                Own a flat or house in Delhi NCR?
              </h3>
              <p className="mt-1 text-sm text-slate-dark">
                Inspections with photos, bills paid, tenants found and managed. From $29/mo.
              </p>
            </div>
          </div>
          <Link
            href="/keys"
            className="shrink-0 rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-ink hover:opacity-90"
          >
            Explore Goodson Keys →
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
