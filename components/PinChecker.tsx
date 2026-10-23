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
          className={`${compact ? "flex w-full" : "mx-auto mt-6 flex max-w-sm"} items-center gap-2`}
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
              ✓ Good news - our on-ground team covers this area. All plans available.
            </span>
          )}
          {status === "not-covered" && (
            <span className="inline-flex flex-wrap items-center gap-2 text-slate">
              No on-ground team here yet - but{" "}
              <strong className="text-ink">Companion Remote</strong> may be available here*.
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("goodson:region", { detail: "remote" }));
                  document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full bg-go-soft px-3 py-1 text-xs font-semibold text-go hover:underline"
              >
                See Companion Remote →
              </button>
              <span className="block w-full text-[11px] text-slate">
                *Some services may be limited in remote and rural areas.
              </span>
            </span>
          )}
        </div>
  );

  if (compact) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div>
          <p className="flex items-center gap-2 text-base font-semibold text-ink sm:text-lg">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-go" />
            First, check if we serve your parents&apos; area
          </p>
          <p className="mt-1 text-sm text-slate">
            <span className="font-semibold text-ink">On-ground team in Delhi NCR</span> (Delhi,
            Gurugram, Noida, Ghaziabad, Faridabad). Companion Remote is available in most cities across India.
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          {form}
          {result}
        </div>
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
          See if we&apos;re already in your parents&apos; neighbourhood (Delhi NCR)
        </h3>
        {form}
        {result}
      </div>
    </section>
  );
}
