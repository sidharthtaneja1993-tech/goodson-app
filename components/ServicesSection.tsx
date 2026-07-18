const SERVICES = [
  {
    title: "Medical coordination",
    detail:
      "Appointment scheduling, hospital escorts, and a summary sent to you after every visit.",
  },
  {
    title: "Home management",
    detail: "Repairs, maintenance, and vendor coordination handled end to end.",
  },
  {
    title: "Government & banking",
    detail: "Paperwork, renewals, and bank visits so your parents don't have to queue alone.",
  },
  {
    title: "Daily errands",
    detail: "Groceries, bill payments, and the small tasks that add up.",
  },
  {
    title: "Transport",
    detail: "Reliable, vetted transport for appointments and outings.",
  },
  {
    title: "Family updates",
    detail: "Regular updates on WhatsApp, in whatever detail you want.",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-ink px-6 py-24 text-paper sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-marigold" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-dark">
            What we handle
          </span>
        </div>
        <h2 className="font-display max-w-xl text-4xl leading-tight sm:text-5xl">
          Everything that usually falls through the cracks from a distance
        </h2>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.title} className="border-t border-line-dark pt-5">
              <h3 className="font-display text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-dark">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
