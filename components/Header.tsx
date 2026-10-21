import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-6 py-6 sm:px-10">
      <Link href="/" className="group block">
        <span className="font-display block text-4xl leading-none tracking-tight text-ink sm:text-5xl">
          Goodson
        </span>
        <span className="mt-2 block max-w-[15rem] text-xs leading-snug text-slate sm:max-w-none sm:text-sm">
          Protect your parents at home,{" "}
          <span className="whitespace-nowrap rounded-md bg-go-soft px-1.5 py-0.5 font-semibold text-go">
            for less than a coffee a day.
          </span>
        </span>
      </Link>
      <nav className="flex items-center gap-6 pt-2 text-sm text-slate">
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
