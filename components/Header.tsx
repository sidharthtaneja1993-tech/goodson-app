import Link from "next/link";

// variant="keys" turns the header into the Goodson Keys (property care) header.
export default function Header({ variant = "care" }: { variant?: "care" | "keys" }) {
  const keys = variant === "keys";
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-6 py-6 sm:px-10">
      <Link href={keys ? "/keys" : "/"} className="group block">
        <span className="font-display block text-4xl leading-none tracking-tight text-ink sm:text-5xl">
          Goodson
          {keys && (
            <span className="ml-2 inline-flex items-center gap-1.5 align-middle">
              <span className="rounded-xl bg-marigold px-2.5 py-1 text-2xl text-ink sm:text-3xl">Keys</span>
            </span>
          )}
        </span>
        <span className="mt-2 block max-w-[15rem] text-xs leading-snug text-slate sm:max-w-none sm:text-sm">
          {keys ? (
            <>
              Your home in India,{" "}
              <span className="whitespace-nowrap rounded-md bg-go-soft px-1.5 py-0.5 font-semibold text-go">
                looked after while you&apos;re away.
              </span>
            </>
          ) : (
            <>
              Protect your parents at home,{" "}
              <span className="whitespace-nowrap rounded-md bg-go-soft px-1.5 py-0.5 font-semibold text-go">
                for less than a coffee a day.
              </span>
            </>
          )}
        </span>
      </Link>
      <nav className="flex items-center gap-6 pt-2 text-sm text-slate">
        {keys ? (
          <>
            <Link href="/keys#home-plans" className="hidden hover:text-ink sm:inline">
              Plans
            </Link>
            <Link href="/keys#faq" className="hidden hover:text-ink sm:inline">
              FAQ
            </Link>
            <Link href="/" className="hover:text-ink">
              Parent care →
            </Link>
          </>
        ) : (
          <>
            <Link href="/#plans" className="hidden hover:text-ink sm:inline">
              Plans
            </Link>
            <Link href="/keys" className="hidden items-center gap-1.5 hover:text-ink sm:inline-flex">
              Property care
              <span className="rounded-full bg-marigold px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
                New
              </span>
            </Link>
            <Link href="/login" className="hover:text-ink">
              Log in
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
