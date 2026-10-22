import FadeIn from "@/components/FadeIn";

// An illustrative example of the WhatsApp update families receive after a
// visit. Clearly labelled "Example" - names and readings are made up.
const MESSAGES: { from: "goodson" | "family"; time: string; lines: string[] }[] = [
  {
    from: "goodson",
    time: "11:42 AM",
    lines: ["Hi Ankit 👋 Just finished today's visit with Aunty and Uncle. All good at home!"],
  },
  {
    from: "goodson",
    time: "11:43 AM",
    lines: [
      "✅ BP checked: 128/82",
      "✅ Medicines restocked for 30 days",
      "✅ Electricity bill paid",
      "✅ Plumber fixed the kitchen tap",
    ],
  },
  {
    from: "goodson",
    time: "11:44 AM",
    lines: [
      "📅 Cardiology follow-up booked for Thursday, 10:30 AM. I'll escort Uncle and send you the doctor's notes after.",
    ],
  },
  {
    from: "goodson",
    time: "11:45 AM",
    lines: ["Aunty says the new knee brace is helping. She sends her love 🙂"],
  },
  {
    from: "family",
    time: "11:52 AM",
    lines: ["Thank you so much, Rohan 🙏 This means a lot."],
  },
];

export default function SampleUpdate() {
  return (
    <section className="bg-linen px-6 py-24 sm:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_420px]">
        <FadeIn>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-marigold-deep" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate">
              After every visit
            </span>
          </div>
          <h2 className="font-display max-w-lg text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
            You&apos;ll know exactly how they are, every time.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate">
            Your concierge sends a WhatsApp update after each visit: health
            readings, errands done, appointments booked, and a few words from
            your parents. No chasing, no guessing.
          </p>
          <ul className="mt-8 space-y-3 text-ink">
            {[
              "Health readings and medicine status",
              "Errands and bills completed",
              "Upcoming appointments, with doctor's notes after",
              "Photos from the visit, when your parents are happy to share",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="text-go">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="relative mx-auto w-full max-w-[420px]">
            <span className="absolute -top-3 right-6 z-10 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-paper">
              Example update
            </span>
            <div className="overflow-hidden rounded-[28px] border border-line bg-paper shadow-2xl">
              {/* Chat header */}
              <div className="flex items-center gap-3 bg-[#075E54] px-5 py-4 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-marigold font-display text-lg text-ink">
                  G
                </div>
                <div>
                  <p className="text-sm font-semibold">Goodson · Rohan</p>
                  <p className="text-xs text-white/75">Your concierge in Delhi</p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3 bg-[#ECE5DD] px-4 py-5">
                <div className="mx-auto w-fit rounded-md bg-white/80 px-3 py-1 text-[11px] font-medium text-slate">
                  TODAY
                </div>

                <div className="ml-0 mr-10 overflow-hidden rounded-xl rounded-tl-sm bg-white shadow-sm">
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-linen to-line text-sm text-slate">
                    Photo from today&apos;s visit
                  </div>
                  <p className="px-3 pb-1 pt-2 text-[11px] text-slate text-right">11:41 AM</p>
                </div>

                {MESSAGES.map((m, i) => (
                  <div
                    key={i}
                    className={`w-fit max-w-[85%] rounded-xl px-3 py-2 text-[13.5px] leading-snug text-[#111] shadow-sm ${
                      m.from === "family"
                        ? "ml-auto rounded-tr-sm bg-[#DCF8C6]"
                        : "rounded-tl-sm bg-white"
                    }`}
                  >
                    {m.lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                    <p className="mt-1 text-right text-[11px] text-[#667781]">
                      {m.time}
                      {m.from === "family" && <span className="ml-1 text-[#53BDEB]">✓✓</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
