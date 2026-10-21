"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";

export default function WaitlistModal({
  open,
  onClose,
  plan,
  cycle,
}: {
  open: boolean;
  onClose: () => void;
  plan: string | null;
  cycle: "monthly" | "annual";
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );

  useEffect(() => {
    // Deliberate: reset the success/error state each time the modal is
    // re-opened for a different plan selection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setState("idle");
  }, [open]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan, billing_cycle: cycle }),
      });
      if (!res.ok) throw new Error("failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-paper p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="font-display text-2xl text-ink">Join the waitlist</h3>
            {plan && (
              <p className="mt-1 text-sm text-slate">
                Plan: <span className="capitalize font-medium">{plan}</span> ·{" "}
                {cycle === "monthly" ? "Monthly" : "Annual"}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate hover:text-ink"
          >
            ✕
          </button>
        </div>

        {state === "done" ? (
          <div className="py-6 text-center">
            <p className="font-display text-xl text-ink">You&apos;re on the list.</p>
            <p className="mt-2 text-sm text-slate">
              We&apos;ll reach out on WhatsApp to confirm your parents&apos; details.
              Want to talk sooner? Message us now.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <a
                href={whatsappLink(
                  plan
                    ? `Hi Goodson, I just joined the waitlist for the ${
                        plan.charAt(0).toUpperCase() + plan.slice(1)
                      } plan (${cycle}). My name is ${form.name}.`
                    : `Hi Goodson, I just joined the waitlist. My name is ${form.name}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Chat with us on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="text-sm text-slate hover:text-ink"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Your name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                WhatsApp number
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555 000 0000"
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Parents&apos; PIN code
              </label>
              <input
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Anything we should know? (optional)
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>

            {state === "error" && (
              <p className="text-sm text-rose-ash">
                Something went wrong - please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={state === "submitting"}
              className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-paper hover:opacity-90 disabled:opacity-60"
            >
              {state === "submitting" ? "Submitting…" : "Join the waitlist"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
