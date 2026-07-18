"use client";

import { useEffect, useState } from "react";

const ABROAD_TZ_OPTIONS = [
  { label: "New York", tz: "America/New_York" },
  { label: "London", tz: "Europe/London" },
  { label: "Toronto", tz: "America/Toronto" },
  { label: "Sydney", tz: "Australia/Sydney" },
  { label: "Dubai", tz: "Asia/Dubai" },
];

function timeIn(tz: string, date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
  }).format(date);
}

function dayLabel(tz: string, date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: tz,
  }).format(date);
}

// Signature element: two clocks joined by a pulsing line, standing in for
// the thing every NRI customer is actually buying - someone reliably
// present on the other side of the distance.
export default function DualClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [abroadTz, setAbroadTz] = useState(ABROAD_TZ_OPTIONS[0].tz);

  useEffect(() => {
    // Deliberate: server renders null (avoids a hydration mismatch on the
    // clock text), client fills in the real time immediately on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 15000);
    try {
      const guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = ABROAD_TZ_OPTIONS.find((o) => o.tz === guess);
      if (match) setAbroadTz(match.tz);
    } catch {
      // ignore
    }
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div className="h-40" aria-hidden />;
  }

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      <div className="text-right">
        <label className="sr-only" htmlFor="abroad-tz">
          Your city
        </label>
        <select
          id="abroad-tz"
          value={abroadTz}
          onChange={(e) => setAbroadTz(e.target.value)}
          className="mb-1 bg-transparent text-xs uppercase tracking-wider text-slate-dark cursor-pointer border-none outline-none"
        >
          {ABROAD_TZ_OPTIONS.map((o) => (
            <option key={o.tz} value={o.tz} className="text-charcoal">
              {o.label}
            </option>
          ))}
        </select>
        <div className="font-display text-3xl sm:text-4xl text-paper">
          {timeIn(abroadTz, now)}
        </div>
        <div className="text-xs text-slate-dark">{dayLabel(abroadTz, now)}</div>
      </div>

      <svg
        width="56"
        height="24"
        viewBox="0 0 56 24"
        className="shrink-0"
        aria-hidden
      >
        <line
          x1="2"
          y1="12"
          x2="54"
          y2="12"
          stroke="var(--marigold)"
          strokeWidth="1.5"
          className="bridge-line"
        />
        <circle cx="2" cy="12" r="2.5" fill="var(--marigold)" />
        <circle cx="54" cy="12" r="2.5" fill="var(--marigold)" />
      </svg>

      <div>
        <div className="mb-1 text-xs uppercase tracking-wider text-slate-dark">
          Your parents · India
        </div>
        <div className="font-display text-3xl sm:text-4xl text-paper">
          {timeIn("Asia/Kolkata", now)}
        </div>
        <div className="text-xs text-slate-dark">
          {dayLabel("Asia/Kolkata", now)}
        </div>
      </div>
    </div>
  );
}
