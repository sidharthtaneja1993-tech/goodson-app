import Link from "next/link";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-paper">
      <div className="relative bg-linen px-6 pb-14 pt-32 sm:px-10 sm:pt-40">
        <Header />
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate">Last updated: {updated}</p>
        </div>
      </div>

      <div className="px-6 py-16 sm:px-10">
        <article className="mx-auto max-w-3xl space-y-6 text-charcoal [&_h2]:font-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:text-slate [&_li]:leading-relaxed [&_li]:text-slate [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-ink [&_a]:underline">
          {children}
        </article>

        <div className="mx-auto mt-16 max-w-3xl border-t border-line pt-8 text-sm text-slate">
          <p>
            Questions about this policy? Reach out on WhatsApp, or{" "}
            <Link href="/" className="text-ink underline">
              return to the homepage
            </Link>
            .
          </p>
          <address className="mt-4 not-italic">
            Goodson Ventures Pvt Ltd
            <br />
            Bestech Business Tower, Sohna Road, Sector 48,
            <br />
            Gurugram, HR, 122018
          </address>
        </div>
      </div>

      <Footer />
    </main>
  );
}
