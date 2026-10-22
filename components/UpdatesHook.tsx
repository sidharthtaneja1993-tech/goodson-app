import Link from "next/link";
import FadeIn from "@/components/FadeIn";

// Small homepage teaser that links to the full example on /updates.
export default function UpdatesHook() {
  return (
    <section className="bg-linen px-6 py-16 sm:px-10">
      <FadeIn>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 rounded-2xl border border-line bg-paper p-6 shadow-sm sm:p-8 md:flex-row md:gap-10">
          <div className="w-full max-w-xs shrink-0 rounded-2xl bg-[#ECE5DD] p-3">
            <div className="w-fit max-w-full rounded-xl rounded-tl-sm bg-white px-3 py-2 text-[13px] leading-snug text-[#111] shadow-sm">
              <p className="mb-1 text-[11px] font-semibold text-[#075E54]">Goodson · your concierge</p>
              <p>✅ BP checked: 128/82</p>
              <p>✅ Medicines restocked</p>
              <p>📅 Doctor booked for Thursday</p>
              <p className="mt-1 text-right text-[11px] text-[#667781]">11:43 AM</p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="font-mono text-xs uppercase tracking-widest text-slate">After every visit</p>
            <h3 className="font-display mt-2 text-2xl leading-tight text-ink sm:text-3xl">
              A WhatsApp update, so you always know how they are.
            </h3>
            <Link
              href="/updates"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-go hover:underline"
            >
              See an example update <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
