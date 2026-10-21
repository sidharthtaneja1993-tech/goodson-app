import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ParentProfileForm from "@/components/ParentProfileForm";
import { termLabel } from "@/lib/plans";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan, billing_cycle, is_admin")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-linen px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-ink">
            Goodson
          </Link>
          <form action="/auth/signout" method="post">
            <SignOutButton />
          </form>
        </div>

        <h1 className="font-display mt-10 text-3xl text-ink sm:text-4xl">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-8">
          <h2 className="font-display text-xl text-ink">Your plan</h2>
          {profile?.plan ? (
            <p className="mt-2 text-slate">
              <span className="capitalize font-medium text-ink">
                {profile.plan}
              </span>{" "}
              · {termLabel(profile.billing_cycle)}
            </p>
          ) : (
            <p className="mt-2 text-slate">
              No active plan yet. Reach out on WhatsApp to get set up, or{" "}
              <Link href="/#plans" className="underline text-ink">
                pick a plan
              </Link>
              .
            </p>
          )}
        </div>

        <ParentProfileForm userId={user.id} />

        {profile?.is_admin && (
          <div className="mt-6 rounded-2xl border border-marigold-deep bg-paper p-6">
            <p className="text-sm text-slate">
              You have admin access.{" "}
              <Link href="/admin" className="font-medium text-ink underline">
                Go to admin dashboard
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function SignOutButton() {
  return (
    <button
      type="submit"
      className="rounded-full border border-line px-4 py-2 text-sm text-slate hover:border-ink hover:text-ink"
    >
      Sign out
    </button>
  );
}
