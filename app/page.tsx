"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DualClock from "@/components/DualClock";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import PinChecker from "@/components/PinChecker";
import SubscribeModal from "@/components/SubscribeModal";
import FadeIn from "@/components/FadeIn";
import CounterStat from "@/components/CounterStat";
import UpdatesHook from "@/components/UpdatesHook";
import HomeCareHook from "@/components/HomeCareHook";
import type { CurrencyCode, PlanId } from "@/lib/plans";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [rate, setRate] = useState<number | null>(1);

  function openSubscribe(plan: PlanId | null) {
    setSelectedPlan(plan);
    setModalOpen(true);
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-linen px-6 pb-24 pt-40 text-charcoal sm:px-10 sm:pt-48">
        <Header />
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <div className="mb-12">
              <PinChecker compact />
            </div>
          </FadeIn>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <FadeIn>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-marigold" />
                <span className="font-mono text-xs uppercase tracking-widest text-slate">
                  Premium concierge care, for families abroad
                </span>
              </div>
              <h1 className="font-display max-w-xl text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-6xl">
                A premium concierge for your parents, on the ground in India.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
                From household chores and banking errands to medical
                coordination and emergency response - Goodson handles it all
                for your elderly parents, so distance stops being the thing
                you worry about.
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-alert/30 bg-alert-soft px-4 py-2 text-sm text-ink">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-alert" />
                </span>
                <span>
                  <strong className="font-semibold text-alert">24×7 emergency response &amp; hospital coordination</strong>
                  <span className="text-slate"> · included in every plan</span>
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openSubscribe(null)}
                  className="rounded-full bg-marigold px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-marigold/20"
                >
                  Subscribe now
                </button>
                <a
                  href="#plans"
                  className="rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-ink"
                >
                  See plans
                </a>
                <Link
                  href="/updates"
                  className="inline-flex items-center gap-2 rounded-full border border-go/30 bg-go-soft px-6 py-3.5 text-sm font-semibold text-go transition-colors duration-200 hover:border-go"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M4 5h16v11H9l-4 4v-4H4z" />
                    <path d="M8 9h8M8 12h5" />
                  </svg>
                  See a sample update
                </Link>
              </div>

            </FadeIn>

            <FadeIn delay={150}>
              <div className="overflow-hidden rounded-2xl border border-line shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                <Image
                  src="/hero-team.png"
                  alt="A Goodson caregiver visiting with an elderly couple at home"
                  width={1200}
                  height={900}
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="mt-5 flex justify-center rounded-2xl border border-line-dark bg-ink p-6 text-paper">
                <DualClock />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CounterStat
        value={280}
        label="Parents currently availing Goodson's care"
      />

      <ServicesSection />
      <UpdatesHook />
      <HomeCareHook />
      <TestimonialsSection />
      <PricingSection
        onSelectPlan={(plan, cur, r) => {
          setCurrency(cur);
          setRate(r);
          openSubscribe(plan);
        }}
      />

      <section className="px-6 py-28 sm:px-10">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Ready when you are
            </h2>
            <p className="mt-4 text-slate">
              Pick a plan and a subscription length, and we&apos;ll reach out on WhatsApp to set things up.
            </p>
            <button
              onClick={() => openSubscribe(null)}
              className="mt-8 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/20"
            >
              Subscribe now
            </button>
          </div>
        </FadeIn>
      </section>

      <Footer />

      <SubscribeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPlan={selectedPlan}
        currency={currency}
        rate={rate}
      />
    </main>
  );
}
