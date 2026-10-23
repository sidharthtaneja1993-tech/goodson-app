import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { planName, termLabel } from "@/lib/plans";
import { formatAmount } from "@/lib/payments";
import type { IntakeData } from "@/lib/onboarding";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ cancel?: string }>;
}) {
  const { cancel } = await searchParams;
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

  const { data: intakes } = await supabase
    .from("parent_intakes")
    .select("id, status, name, email, phone, plan, term, data, submitted_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      "id, razorpay_subscription_id, status, cancel_requested, plan, term, amount, currency, name, email, phone, paid_count, current_end, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const { data: payments } = await supabase
    .from("payments")
    .select("id, status, plan, term, amount, currency, name, email, phone, razorpay_payment_id, paid_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

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

        {cancel === "ok" && (
          <p className="mt-6 rounded-lg bg-go-soft px-4 py-3 text-sm text-go">
            Done - that subscription won&apos;t renew again. Service continues until the end of the paid period.
          </p>
        )}
        {cancel === "error" && (
          <p className="mt-6 rounded-lg bg-alert-soft px-4 py-3 text-sm text-alert">
            Couldn&apos;t cancel that subscription. Try again, or cancel it in the Razorpay dashboard.
          </p>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl text-ink">
            Parents&apos; details ({intakes?.filter((x) => x.status === "submitted").length ?? 0} received,{" "}
            {intakes?.filter((x) => x.status !== "submitted").length ?? 0} waiting)
          </h2>
          <div className="mt-4 space-y-3">
            {intakes?.map((x) => {
              const d = x.data as IntakeData | null;
              return (
                <details key={x.id} className="rounded-2xl border border-line bg-paper px-5 py-4">
                  <summary className="flex cursor-pointer flex-wrap items-center gap-3 text-sm">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        x.status === "submitted" ? "bg-go-soft text-go" : "bg-alert-soft text-alert"
                      }`}
                    >
                      {x.status === "submitted" ? "received" : "waiting for family"}
                    </span>
                    <span className="font-semibold text-ink">{x.name}</span>
                    <span className="text-slate">
                      {planName(x.plan)} ({termLabel(x.term)}) · {x.phone}
                    </span>
                    {d?.parents?.length ? (
                      <span className="text-slate">· Parents: {d.parents.map((p) => p.name).join(" & ")}</span>
                    ) : null}
                  </summary>
                  {d ? (
                    <div className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                      {d.parents.map((p, i) => (
                        <div key={i} className="sm:col-span-2">
                          <p>
                            <span className="text-slate">Parent {i + 1}: </span>
                            <strong>
                              {[p.name, p.age && `${p.age} yrs`, p.gender, p.phone, p.languages]
                                .filter(Boolean)
                                .join(" · ")}
                            </strong>
                          </p>
                          {(
                            [
                              ["Conditions", p.conditions],
                              ["Medicines", p.medicines],
                              ["Doctor", p.doctor],
                              ["Mobility / allergies", p.mobility],
                            ] as [string, string][]
                          )
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <p key={k} className="pl-4">
                                <span className="text-slate">{k}: </span>
                                {v}
                              </p>
                            ))}
                        </div>
                      ))}
                      <p>
                        <span className="text-slate">Address: </span>
                        {d.address}, {d.city} {d.pincode}
                      </p>
                      {(
                        [
                          ["Lives with / help", d.livesWith],
                          ["Spare key", d.keys],
                          ["Preferred hospital", d.hospital],
                          ["Best time to call", d.callTime],
                          ["Updates", d.updates],
                          ["Never without asking", d.neverWithout],
                          ["Notes", d.notes],
                        ] as [string, string][]
                      )
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <p key={k}>
                            <span className="text-slate">{k}: </span>
                            {v}
                          </p>
                        ))}
                      {d.contacts.map((c, i) => (
                        <p key={`c${i}`}>
                          <span className="text-slate">Emergency contact {i + 1}: </span>
                          {[c.name, c.relation, c.phone].filter(Boolean).join(" · ")}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate">
                      Not filled in yet. The link was emailed to {x.email}. A gentle WhatsApp reminder helps.
                    </p>
                  )}
                </details>
              );
            })}
            {!intakes?.length && (
              <p className="rounded-2xl border border-line bg-paper px-5 py-6 text-center text-sm text-slate">
                No parents&apos; details yet.
              </p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-ink">
            Auto-renew subscriptions (
            {subscriptions?.filter((x) => x.status === "active" && !x.cancel_requested).length ?? 0} active)
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Each renewal</th>
                  <th className="px-4 py-3">Payments</th>
                  <th className="px-4 py-3">Next renewal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {subscriptions?.map((x) => {
                  const label = x.cancel_requested && x.status === "active" ? "ends at period end" : x.status;
                  const tone =
                    x.status === "active" && !x.cancel_requested
                      ? "bg-go-soft text-go"
                      : x.status === "halted" || x.status === "pending"
                        ? "bg-alert-soft text-alert"
                        : "bg-linen text-slate";
                  return (
                    <tr key={x.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>{label}</span>
                      </td>
                      <td className="px-4 py-3">
                        {x.name}
                        <span className="block text-xs text-slate">
                          {x.email} · {x.phone}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {planName(x.plan)} ({termLabel(x.term)})
                      </td>
                      <td className="px-4 py-3">{formatAmount(x.amount, x.currency)}</td>
                      <td className="px-4 py-3">{x.paid_count}</td>
                      <td className="px-4 py-3 text-slate">
                        {x.current_end && !x.cancel_requested && x.status === "active"
                          ? new Date(x.current_end).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {x.status === "active" && !x.cancel_requested && (
                          <details>
                            <summary className="cursor-pointer text-xs font-semibold text-alert">Cancel…</summary>
                            <form action="/api/admin/subscriptions/cancel" method="post" className="mt-2">
                              <input type="hidden" name="subscription_id" value={x.razorpay_subscription_id} />
                              <button
                                type="submit"
                                className="rounded-full bg-alert px-3 py-1 text-xs font-semibold text-white"
                              >
                                Stop renewals
                              </button>
                            </form>
                          </details>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {!subscriptions?.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate">
                      No auto-renew subscriptions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-ink">
            Payments ({payments?.filter((p) => p.status === "paid").length ?? 0} paid)
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-paper">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Razorpay ID</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments?.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.status === "paid"
                            ? "bg-go-soft text-go"
                            : p.status === "failed"
                              ? "bg-alert-soft text-alert"
                              : "bg-linen text-slate"
                        }`}
                      >
                        {p.status === "created" ? "not completed" : p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.name}
                      <span className="block text-xs text-slate">{p.email}</span>
                    </td>
                    <td className="px-4 py-3">{p.phone}</td>
                    <td className="px-4 py-3 capitalize">
                      {planName(p.plan)} ({termLabel(p.term)})
                    </td>
                    <td className="px-4 py-3">{formatAmount(p.amount, p.currency)}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.razorpay_payment_id || "—"}</td>
                    <td className="px-4 py-3 text-slate">
                      {new Date(p.paid_at || p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!payments?.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate">
                      No payments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl text-ink">
            Subscription requests ({waitlist?.length ?? 0})
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
                      {planName(w.plan) || "—"} {w.billing_cycle ? `(${termLabel(w.billing_cycle)})` : ""}
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
                    <td className="px-4 py-3 capitalize">{planName(c.plan) || "—"}</td>
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
