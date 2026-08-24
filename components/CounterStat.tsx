"use client";

import { useEffect, useRef, useState } from "react";

// Big, bold statement band with a count-up animation - triggers once
// the number scrolls into view.
export default function CounterStat({
  value,
  suffix = "+",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [started, value]);

  return (
    <div
      ref={ref}
      className="border-y border-line bg-paper px-6 py-14 text-center sm:px-10"
    >
      <p className="font-display text-6xl tracking-tight text-ink sm:text-7xl">
        {display}
        {suffix}
      </p>
      <p className="mt-3 text-sm uppercase tracking-widest text-slate">
        {label}
      </p>
    </div>
  );
}
