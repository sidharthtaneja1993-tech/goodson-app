import Link from "next/link";

// Thin announcement bar at the very top of the homepage, pointing to Goodson Keys.
export default function KeysBar() {
  return (
    <Link
      href="/keys"
      className="group flex items-center justify-center gap-2.5 bg-ink px-4 py-2.5 text-center text-xs text-paper sm:text-sm"
    >
      <span className="shrink-0 rounded-full bg-marigold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
        New
      </span>
      <span>
        <span className="font-semibold">Goodson Keys</span>
        <span className="hidden sm:inline">: property care for your home in Delhi NCR. From $39/mo.</span>
        <span className="sm:hidden">: property care in Delhi NCR</span>
      </span>
      <span className="shrink-0 underline underline-offset-4 group-hover:text-marigold">Explore →</span>
    </Link>
  );
}
