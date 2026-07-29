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
import WaitlistModal from "@/components/WaitlistModal";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  function openGetStarted(plan: string | null, cycle: "monthly" | "annual" = "monthly") {
    setSelectedPlan(plan);
    setSelectedCycle(cycle);
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
                <span className="h-px w-8 bg-marigold-deep" />
                <span className="font-mono text-xs uppercase tracking-widest text-slate">
                  For families abroad
                </span>
              </div>
              <h1 className="font-display max-w-xl text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-6xl">
                Someone dependable, on the ground, for your parents in India.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
                Goodson coordinates medical care, home management, and daily
                errands for elderly parents - so distance stops being the
                thing you worry about.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openGetStarted(null)}
                  className="rounded-full bg-marigold px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-marigold/20"
                >
                  Get started
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
            <div className="mt-16 rounded-2xl border border-line bg-ink p-8 text-paper sm:inline-flex">
              <DualClock />
            </div>
          </FadeIn>
        </div>
      </section>

      <ServicesSection />
      <TestimonialsSection />
      <PricingSection onSelectPlan={(plan, cycle) => openGetStarted(plan, cycle)} />
      <PinChecker />

      <section className="px-6 py-28 sm:px-10">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Ready when you are
            </h2>
            <p className="mt-4 text-slate">
              Get started and we&apos;ll reach out on WhatsApp to set things up.
            </p>
            <button
              onClick={() => openGetStarted(null)}
              className="mt-8 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/20"
            >
              Get started
            </button>
          </div>
        </FadeIn>
      </section>

      <Footer />

      <WaitlistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={selectedPlan}
        cycle={selectedCycle}
      />
    </main>
  );
}
