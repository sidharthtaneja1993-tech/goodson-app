import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-12 text-slate-dark sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg text-paper">Goodson</p>
          <p className="mt-1 text-sm">
            Concierge care for parents in India, coordinated for families abroad.
          </p>
          <p className="mt-4 text-sm">
            <span className="block">WhatsApp: available once you join the waitlist</span>
            <span className="mt-1 block">© {new Date().getFullYear()} Goodson</span>
          </p>
          <address className="mt-4 text-sm not-italic">
            Goodson Ventures Pvt Ltd
            <br />
            Bestech Business Tower, Sohna Road, Sector 48,
            <br />
            Gurugram, HR, 122018
          </address>
        </div>

        <nav className="flex flex-col gap-2 text-sm sm:items-end">
          <Link href="/privacy" className="hover:text-paper">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-paper">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="hover:text-paper">
            Refund &amp; Cancellation Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
