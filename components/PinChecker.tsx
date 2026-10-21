"use client";

import { useState } from "react";

export default function PinChecker({ compact = false }: { compact?: boolean }) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "covered" | "not-covered" | "invalid"
  >("idle");

  async function checkPin(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    try {
      const res = await fetch(`/api/pin-check?pincode=${pin}`);
      const data = await res.json();
      setStatus(data.covered ? "covered" : "not-covered");
    } catch {
      setStatus("not-covered");
    }
  }

  const form = (
        <form
          onSubmit={checkPin}
          className={`${compact ? "flex w-full max-w-md" : "mx-auto mt-6 flex max-w-sm"} items-center gap-2`}
        >
          <input
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit PIN code"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setStatus("idle");
            }}
            className="flex-1 rounded-full border border-line bg-linen px-4 py-3 text-center font-mono text-sm tracking-widest text-charcoal outline-none focus:border-marigold-deep"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:opacity-90"
          >
            Check
          </button>
        </form>
  );

  const result = (
        <div className={`${compact ? "mt-2 min-h-5 text-left" : "mt-4 h-6"} text-sm`}>
          {status === "checking" && (
            <span className="text-slate">Checking…</span>
          )}
          {status === "invalid" && (
            <span className="font-medium text-alert">Enter a valid 6-digit PIN code.</span>
          )}
          {status === "covered" && (
            <span className="inline-flex items-center gap-2 rounded-full bg-go-soft px-3 py-1 font-semibold text-go">
              ✓ Good news - we currently serve this area.
            </span>
          )}
          {status === "not-covered" && (
            <span className="text-slate">
              Not yet in this area - tap Subscribe now and we&apos;ll let you know as soon as we expand.
            </span>
          )}
        </div>
  );

  if (compact) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5 shadow-sm sm:p-6">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <span className="inline-flex h-2 w-2 rounded-full bg-go" />
          First, check if we serve your parents&apos; area
        </p>
        {form}
        {result}
      </div>
    );
  }

  return (
    <section className="border-y border-line bg-paper px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-slate">
          Coverage check
        </span>
        <h3 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
          See if we&apos;re already in your parents&apos; neighbourhood
        </h3>
        {form}
        {result}
      </div>
    </section>
  );
}
