"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Parent = {
  id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_notes: string | null;
};

const EMPTY_FORM = {
  full_name: "",
  age: "",
  gender: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  medical_notes: "",
};

export default function ParentProfileForm({ userId }: { userId: string }) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function loadParents() {
    setLoading(true);
    const { data, error } = await supabase
      .from("parents")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data) setParents(data as Parent[]);
    setLoading(false);
  }

  useEffect(() => {
    // Deliberate: fetch this customer's parent records once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadParents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError(null);
  }

  function startEdit(p: Parent) {
    setForm({
      full_name: p.full_name,
      age: p.age?.toString() ?? "",
      gender: p.gender ?? "",
      phone: p.phone ?? "",
      address: p.address ?? "",
      city: p.city ?? "",
      pincode: p.pincode ?? "",
      emergency_contact_name: p.emergency_contact_name ?? "",
      emergency_contact_phone: p.emergency_contact_phone ?? "",
      medical_notes: p.medical_notes ?? "",
    });
    setEditingId(p.id);
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      user_id: userId,
      full_name: form.full_name,
      age: form.age ? parseInt(form.age, 10) : null,
      gender: form.gender || null,
      phone: form.phone || null,
      address: form.address || null,
      city: form.city || null,
      pincode: form.pincode || null,
      emergency_contact_name: form.emergency_contact_name || null,
      emergency_contact_phone: form.emergency_contact_phone || null,
      medical_notes: form.medical_notes || null,
    };

    const { error } = editingId
      ? await supabase.from("parents").update(payload).eq("id", editingId)
      : await supabase.from("parents").insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setShowForm(false);
    loadParents();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this parent's details? This can't be undone.")) return;
    await supabase.from("parents").delete().eq("id", id);
    loadParents();
  }

  return (
    <div className="mt-6 rounded-2xl border border-line bg-paper p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Parent details</h2>
        {!showForm && (
          <button
            onClick={startAdd}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
          >
            + Add parent
          </button>
        )}
      </div>

      {loading && <p className="mt-4 text-sm text-slate">Loading…</p>}

      {!loading && !showForm && parents.length === 0 && (
        <p className="mt-4 text-sm text-slate">
          No parent details on file yet. Add your parent&apos;s information so
          our team has what they need to help.
        </p>
      )}

      {!showForm && parents.length > 0 && (
        <div className="mt-6 space-y-4">
          {parents.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-line bg-linen p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-ink">
                    {p.full_name}
                    {p.age ? `, ${p.age}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-slate">
                    {[p.city, p.pincode].filter(Boolean).join(" · ") || "—"}
                  </p>
                  {p.phone && (
                    <p className="mt-1 text-sm text-slate">{p.phone}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-sm text-ink underline hover:opacity-80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-sm text-rose-ash underline hover:opacity-80"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Full name *
              </label>
              <input
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Age
              </label>
              <input
                inputMode="numeric"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: e.target.value.replace(/\D/g, "") })
                }
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Gender
              </label>
              <input
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
              Address
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                City
              </label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                PIN code
              </label>
              <input
                value={form.pincode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pincode: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Emergency contact name
              </label>
              <input
                value={form.emergency_contact_name}
                onChange={(e) =>
                  setForm({ ...form, emergency_contact_name: e.target.value })
                }
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
                Emergency contact phone
              </label>
              <input
                value={form.emergency_contact_phone}
                onChange={(e) =>
                  setForm({ ...form, emergency_contact_phone: e.target.value })
                }
                className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate">
              Medical notes (conditions, medications, allergies, mobility)
            </label>
            <textarea
              rows={4}
              value={form.medical_notes}
              onChange={(e) =>
                setForm({ ...form, medical_notes: e.target.value })
              }
              className="w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep"
            />
          </div>

          {error && <p className="text-sm text-rose-ash">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Add parent"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-slate hover:border-ink hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
