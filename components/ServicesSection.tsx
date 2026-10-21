import type { ReactNode } from "react";
import FadeIn from "@/components/FadeIn";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const SERVICES: { title: string; detail: string; icon: ReactNode; accent?: "alert" | "go" }[] = [
  {
    title: "Medical coordination",
    accent: "alert",
    detail:
      "Appointment scheduling, hospital escorts, and a summary sent to you after every visit.",
    icon: (
      <Icon>
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
        <path d="M8 11.5h2l1-2 2 4 1-2h2" />
      </Icon>
    ),
  },
  {
    title: "Home management",
    detail: "Repairs, maintenance, and vendor coordination handled end to end.",
    icon: (
      <Icon>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 9.5V20h14V9.5" />
        <path d="M10 20v-6h4v6" />
      </Icon>
    ),
  },
  {
    title: "Government & banking",
    detail: "Paperwork, renewals, and bank visits so your parents don't have to queue alone.",
    icon: (
      <Icon>
        <path d="M3 9l9-5 9 5" />
        <path d="M4 9h16" />
        <path d="M6 11v6M10 11v6M14 11v6M18 11v6" />
        <path d="M3 20h18" />
      </Icon>
    ),
  },
  {
    title: "Daily errands",
    detail: "Groceries, bill payments, and the small tasks that add up.",
    icon: (
      <Icon>
        <path d="M6 8h12l-1 12H7L6 8z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </Icon>
    ),
  },
  {
    title: "Transport",
    detail: "Reliable, vetted transport for appointments and outings.",
    icon: (
      <Icon>
        <path d="M4 16v-3.5L6 7.5h12l2 5V16H4z" />
        <path d="M4 12.5h16" />
        <circle cx="7.5" cy="16.5" r="1.5" />
        <circle cx="16.5" cy="16.5" r="1.5" />
      </Icon>
    ),
  },
  {
    title: "Family updates",
    accent: "go",
    detail: "Regular updates on WhatsApp, in whatever detail you want.",
    icon: (
      <Icon>
        <path d="M4 5h16v11H9l-4 4v-4H4z" />
        <path d="M8 9h8M8 12h5" />
      </Icon>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-ink px-6 py-28 text-paper sm:px-10">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-marigold" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate-dark">
              What we handle
            </span>
          </div>
          <h2 className="font-display max-w-xl text-4xl leading-tight tracking-tight sm:text-5xl">
            Everything that usually falls through the cracks from a distance
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.title} delay={i * 60}>
              <div className="group border-t border-line-dark py-6 transition-colors duration-300 hover:border-marigold">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 ${
                    s.accent === "alert"
                      ? "border-alert-dark/60 bg-alert-dark/10 text-alert-dark"
                      : s.accent === "go"
                        ? "border-go-dark/60 bg-go-dark/10 text-go-dark"
                        : "border-line-dark text-marigold group-hover:border-marigold"
                  }`}>
                  {s.icon}
                </div>
                <h3 className="font-display text-xl transition-transform duration-300 group-hover:translate-x-1">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-dark">{s.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200}>
          <div className="mt-16 grid gap-8 rounded-2xl border border-alert-dark/40 bg-alert-dark/5 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-alert-dark/60 bg-alert-dark/10 text-alert-dark">
                <Icon>
                  <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
                  <path d="M9 12l2 2 4-4" />
                </Icon>
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-alert-dark" />
                <span className="font-mono text-xs uppercase tracking-widest text-alert-dark">
                  For the tricky situations
                </span>
              </div>
              <h3 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                Ex-police and ex-Army men, on our payroll
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-dark">
              Some problems need more than a helpful hand. Our team includes
              retired police officers and former Army personnel who step in
              when things get difficult: a tenant who won&apos;t leave, a
              property dispute, someone pressuring your parents, or an
              emergency in the middle of the night. They handle it calmly,
              firmly, and within the law, so your parents are never left to
              deal with it alone.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
