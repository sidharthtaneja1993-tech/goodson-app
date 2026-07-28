import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  const { data: waitlist } = await supabase
    .from("waitlist")
    .select("id, name, email, phone, pincode, plan, billing_cycle, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: customers } = await supabase
    .from("profiles")
    .select("id, full_name, plan, billing_cycle, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: parents } = await supabase
    .from("parents")
    .select(
      "id, full_name, age, phone, city, pincode, medical_notes, created_at, profiles(full_name)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <main className="min-h-screen bg-linen px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-ink">
            Goodson
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-slate underline hover:text-ink"
          >
            Back to dashboard
          </Link>
        </div>

        <h1 className="font-display mt-10 text-3xl text-ink sm:text-4xl">
          Admin
        </h1>

        <section className="mt-10">
          <h2 className="font-display text-xl text-ink">
            Waitlist ({waitlist?.length ?? 0})
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">PIN</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {waitlist?.map((w) => (
                  <tr key={w.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">{w.name}</td>
                    <td className="px-4 py-3">{w.email}</td>
                    <td className="px-4 py-3">{w.phone}</td>
                    <td className="px-4 py-3">{w.pincode || "—"}</td>
                    <td className="px-4 py-3 capitalize">
                      {w.plan || "—"} {w.billing_cycle ? `(${w.billing_cycle})` : ""}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {new Date(w.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!waitlist?.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate">
                      No waitlist entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-ink">
            Customers ({customers?.length ?? 0})
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Billing</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">{c.full_name || "—"}</td>
                    <td className="px-4 py-3 capitalize">{c.plan || "—"}</td>
                    <td className="px-4 py-3 capitalize">{c.billing_cycle}</td>
                    <td className="px-4 py-3 text-slate">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!customers?.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate">
                      No customer accounts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-ink">
            Parents on file ({parents?.length ?? 0})
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Medical notes</th>
                  <th className="px-4 py-3">Added</th>
                </tr>
              </thead>
              <tbody>
                {parents?.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0 align-top">
                    <td className="px-4 py-3">
                      {p.full_name}
                      {p.age ? `, ${p.age}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      {(p.profiles as unknown as { full_name: string | null } | null)
                        ?.full_name || "—"}
                    </td>
                    <td className="px-4 py-3">{p.phone || "—"}</td>
                    <td className="px-4 py-3">
                      {[p.city, p.pincode].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-4 py-3 max-w-xs whitespace-pre-wrap text-slate">
                      {p.medical_notes || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!parents?.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate">
                      No parent details added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
