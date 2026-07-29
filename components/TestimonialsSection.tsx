import FadeIn from "@/components/FadeIn";

// Only include entries here that are real customers who actually said
// something like this. Do not add placeholder/fabricated quotes back in -
// an empty section is safer than a fake one for a trust-based service.
const TESTIMONIALS = [
  {
    quote:
      "My mother fell on the stairs, and I was thousands of miles away in Canada. Goodson got someone to her within minutes, handled the hospital visit, and called me the whole way through. I've never felt more grateful for a decision I made.",
    name: "Priya",
    detail: "Toronto",
  },
  {
    quote:
      "My parents needed help with everyday chores, and I was worried about them being alone in India. The Goodson team was fast, reliable, and genuinely caring - that anxiety I carried for years has finally eased.",
    name: "Ragini",
    detail: "United States",
  },
  {
    quote:
      "My parents needed help with a hospital visit, which can be so cumbersome to manage from here. Goodson did a wonderful job and stayed constantly in touch with me, supporting us all the way through.",
    name: "Deepa",
    detail: "New Zealand",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="border-y border-line bg-paper px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-marigold-deep" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate">
              Trusted by families abroad
            </span>
          </div>
        </FadeIn>

        <div
          className={`mt-10 grid gap-8 ${
            TESTIMONIALS.length === 1
              ? "max-w-xl mx-auto"
              : TESTIMONIALS.length === 2
                ? "sm:grid-cols-2 max-w-3xl mx-auto"
                : "md:grid-cols-3"
          }`}
        >
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 100}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-linen p-8">
                <blockquote className="font-display flex-1 text-lg leading-snug text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-medium text-ink">{t.name}</span>
                  <span className="text-slate"> · {t.detail}</span>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
