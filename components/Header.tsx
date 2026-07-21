import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10">
      <Link href="/" className="font-display text-xl tracking-tight text-ink">
        Goodson
      </Link>
      <nav className="flex items-center gap-6 text-sm text-slate">
        <Link href="/#plans" className="hidden hover:text-ink sm:inline">
          Plans
        </Link>
        <Link href="/login" className="hover:text-ink">
          Log in
        </Link>
      </nav>
    </header>
  );
}
