import Link from "next/link";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/whatsapp";

// variant="keys" is used on the Goodson Keys (property care) pages.
export default function Footer({ variant = "care" }: { variant?: "care" | "keys" }) {
  const keys = variant === "keys";
  return (
    <footer className="bg-ink px-6 py-12 text-slate-dark sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg text-paper">{keys ? "Goodson Keys" : "Goodson"}</p>
          <p className="mt-1 text-sm">
            {keys
              ? "Property care in Delhi NCR, for owners living abroad."
              : "Concierge care for parents in India, coordinated for families abroad."}
          </p>
          <p className="mt-4 text-sm">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-paper"
            >
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
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
          {keys ? (
            <Link href="/" className="font-semibold text-paper hover:text-marigold">
              Goodson · Care for your parents
            </Link>
          ) : (
            <Link href="/keys" className="font-semibold text-paper hover:text-marigold">
              Goodson Keys · Property care
            </Link>
          )}
          <Link href="/privacy" className="hover:text-paper">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-paper">
            Terms of Service
          </Link>
          <Link href="/refund-policy" className="hover:text-paper">
            Cancellation &amp; Refund Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
