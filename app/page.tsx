"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DualClock from "@/components/DualClock";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import PinChecker from "@/components/PinChecker";
import WaitlistModal from "@/components/WaitlistModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  function openWaitlist(plan: string | null, cycle: "monthly" | "annual" = "monthly") {
    setSelectedPlan(plan);
    setSelectedCycle(cycle);
    setModalOpen(true);
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-ink px-6 pb-24 pt-32 text-paper sm:px-10 sm:pt-40">
        <Header />
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-marigold" />
                <span className="font-mono text-xs uppercase tracking-widest text-slate-dark">
                  For families abroad
                </span>
              </div>
              <h1 className="font-display max-w-xl text-5xl leading-[1.05] sm:text-6xl lg:text-6xl">
                Someone dependable, on the ground, for your parents in India.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-dark">
                Goodson coordinates medical care, home management, and daily
                errands for elderly parents - so distance stops being the
                thing you worry about.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openWaitlist(null)}
                  className="rounded-full bg-marigold px-6 py-3.5 text-sm font-semibold text-ink hover:opacity-90"
                >
                  Join the waitlist
                </button>
                <a
                  href="#plans"
                  className="rounded-full border border-line-dark px-6 py-3.5 text-sm font-semibold text-paper hover:border-paper"
                >
                  See plans
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-line-dark shadow-2xl">
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
          </div>

          <div className="mt-16 rounded-2xl border border-line-dark bg-ink-soft p-8 sm:inline-flex">
            <DualClock />
          </div>
        </div>
      </section>

      <ServicesSection />
      <PricingSection onSelectPlan={(plan, cycle) => openWaitlist(plan, cycle)} />
      <PinChecker />

      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            Ready when you are
          </h2>
          <p className="mt-4 text-slate">
            Join the waitlist and we&apos;ll reach out on WhatsApp to set things up.
          </p>
          <button
            onClick={() => openWaitlist(null)}
            className="mt-8 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper hover:opacity-90"
          >
            Join the waitlist
          </button>
        </div>
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
