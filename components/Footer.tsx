export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-12 text-slate-dark sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg text-paper">Goodson</p>
          <p className="mt-1 text-sm">
            Concierge care for parents in India, coordinated for families abroad.
          </p>
        </div>
        <div className="text-sm">
          <p>WhatsApp: available after you join the waitlist</p>
          <p className="mt-1">© {new Date().getFullYear()} Goodson</p>
        </div>
      </div>
    </footer>
  );
}
