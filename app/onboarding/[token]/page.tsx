import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParentDetailsForm from "@/components/onboarding/ParentDetailsForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { planName, termLabel } from "@/lib/plans";
import { whatsappLink } from "@/lib/whatsapp";
import type { IntakeData } from "@/lib/onboarding";

export const metadata: Metadata = {
  title: "Tell us about your parents — Goodson",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = createAdminClient();
  const { data: intake } = db
    ? await db.from("parent_intakes").select("*").eq("token", token).maybeSingle()
    : { data: null };

  return (
    <main className="bg-linen">
      <div className="relative px-6 pb-10 pt-32 sm:px-10 sm:pt-40">
        <Header />
        <div className="mx-auto max-w-3xl">
          {intake ? (
            <>
              <p className="font-mono text-xs uppercase tracking-widest text-slate">
                {planName(intake.plan)} · {termLabel(intake.term)}
              </p>
              <h1 className="font-display mt-2 text-4xl tracking-tight text-ink sm:text-5xl">
                Tell us about your parents
              </h1>
              <p className="mt-4 max-w-xl text-slate">
                {intake.status === "submitted"
                  ? "We've received these details. You can update them here any time."
                  : `Welcome to Goodson, ${(intake.name || "").split(" ")[0] || "and thank you"}. This takes about 5 minutes and helps your concierge get everything ready before the first visit.`}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">This link isn&apos;t valid</h1>
              <p className="mt-4 max-w-xl text-slate">
                Please use the link from your Goodson email, or{" "}
                <a href={whatsappLink("Hi Goodson, my parents' details link isn't working.")} className="underline">
                  message us on WhatsApp
                </a>{" "}
                and we&apos;ll send you a new one.
              </p>
            </>
          )}
        </div>
      </div>

      {intake && (
        <div className="px-6 pb-20 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <ParentDetailsForm
              token={token}
              customerName={intake.name || ""}
              initial={(intake.data as IntakeData | null) ?? null}
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
