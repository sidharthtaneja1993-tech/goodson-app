"use client";

import { useState } from "react";
import Image from "next/image";
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
      <section className="relative overflow-hidden bg-linen px-6 pb-24 pt-32 text-charcoal sm:px-10 sm:pt-40">
        <Header />
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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

              <div className="mt-10 flex flex-wrap items-center gap-4">
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
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-line shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                  <Image
                    src="/hero-team.png"
                    alt="A Goodson caregiver visiting with an elderly couple at home"
                    width={1200}
                    height={900}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={250}>
            <div className="mt-16 rounded-2xl border border-line-dark bg-ink p-8 text-paper sm:inline-flex">
              <DualClock />
            </div>
          </FadeIn>
        </div>
      </section>

      <CounterStat
        value={280}
        label="Parents currently availing Goodson's care"
      />

      <ServicesSection />
      <TestimonialsSection />
      <PricingSection
        onSelectPlan={(plan, cur, r) => {
          setCurrency(cur);
          setRate(r);
          openSubscribe(plan);
        }}
      />
      <PinChecker />

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
