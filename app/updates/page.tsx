import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SampleUpdate from "@/components/SampleUpdate";

export const metadata = {
  title: "Visit updates on WhatsApp — Goodson",
  description:
    "See an example of the WhatsApp update families receive after every Goodson visit: health readings, errands, appointments and a few words from your parents.",
};

export default function UpdatesPage() {
  return (
    <main>
      <section className="relative bg-linen px-6 pt-28 sm:px-10 sm:pt-32">
        <Header />
      </section>

      <SampleUpdate />

      <section className="border-t border-line bg-paper px-6 py-20 text-center sm:px-10">
        <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Want updates like this for your parents?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate">
          Every Goodson plan includes WhatsApp updates from your parents&apos; concierge.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#plans"
            className="rounded-full bg-marigold px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-marigold/20"
          >
            See plans
          </Link>
          <Link
            href="/"
            className="rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
          >
            Back to home
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
