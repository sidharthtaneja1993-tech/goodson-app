"use client";

import { useState } from "react";

export default function PinChecker() {
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

  return (
    <section className="border-y border-line bg-paper px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-slate">
          Coverage check
        </span>
        <h3 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
          See if we&apos;re already in your parents&apos; neighbourhood
        </h3>
        <form
          onSubmit={checkPin}
          className="mx-auto mt-6 flex max-w-sm items-center gap-2"
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

        <div className="mt-4 h-6 text-sm">
          {status === "checking" && (
            <span className="text-slate">Checking…</span>
          )}
          {status === "invalid" && (
            <span className="text-rose-ash">Enter a valid 6-digit PIN code.</span>
          )}
          {status === "covered" && (
            <span className="font-medium text-marigold-deep">
              Good news - we currently serve this area.
            </span>
          )}
          {status === "not-covered" && (
            <span className="text-slate">
              Not yet in this area - join the waitlist and we&apos;ll notify you as we expand.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
