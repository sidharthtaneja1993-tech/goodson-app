"use client";

import { useState, type ReactNode } from "react";
import type { IntakeData, ParentInfo } from "@/lib/onboarding";

const EMPTY_PARENT: ParentInfo = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  languages: "",
  conditions: "",
  medicines: "",
  doctor: "",
  mobility: "",
};

const EMPTY: IntakeData = {
  parents: [{ ...EMPTY_PARENT }],
  address: "",
  city: "",
  pincode: "",
  livesWith: "",
  keys: "",
  hospital: "",
  contacts: [
    { name: "", relation: "", phone: "" },
    { name: "", relation: "", phone: "" },
  ],
  callTime: "",
  updates: "After every call or visit",
  neverWithout: "",
  notes: "",
};

const input =
  "w-full rounded-lg border border-line bg-linen px-3 py-2.5 text-charcoal outline-none focus:border-marigold-deep";
const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {required && <span className="text-alert"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate">{hint}</span>}
    </label>
  );
}

function Section({ step, title, intro, children }: { step: number; title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-widest text-slate">Step {step} of 4</p>
      <h2 className="font-display mt-1 text-2xl text-ink">{title}</h2>
      {intro && <p className="mt-1 text-sm text-slate">{intro}</p>}
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

export default function ParentDetailsForm({
  token,
  customerName,
  initial,
}: {
  token: string;
  customerName: string;
  initial: IntakeData | null;
}) {
  const [form, setForm] = useState<IntakeData>(() => {
    if (!initial) return EMPTY;
    const contacts = [...(initial.contacts ?? [])];
    while (contacts.length < 2) contacts.push({ name: "", relation: "", phone: "" });
    const parents = (initial.parents ?? []).map((p) => ({ ...EMPTY_PARENT, ...p }));
    return { ...EMPTY, ...initial, parents: parents.length ? parents : [{ ...EMPTY_PARENT }], contacts };
  });
  const [consentParents, setConsentParents] = useState(Boolean(initial));
  const [consentData, setConsentData] = useState(Boolean(initial));
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof IntakeData>(key: K, value: IntakeData[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setParent = (i: number, key: keyof ParentInfo, value: string) =>
    setForm((f) => ({ ...f, parents: f.parents.map((p, j) => (j === i ? { ...p, [key]: value } : p)) }));
  const setContact = (i: number, key: "name" | "relation" | "phone", value: string) =>
    setForm((f) => ({ ...f, contacts: f.contacts.map((c, j) => (j === i ? { ...c, [key]: value } : c)) }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setError(null);
    try {
      const res = await fetch(`/api/onboarding/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consentParents, consentData }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not save");
      setState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not save - please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-8 text-center sm:p-12">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-go-soft text-2xl text-go">
          ✓
        </div>
        <h2 className="font-display text-3xl text-ink">Thank you, {customerName.split(" ")[0]}.</h2>
        <p className="mx-auto mt-3 max-w-md text-slate">
          We have everything we need. Your concierge will WhatsApp you within 3 days to confirm the
          details and schedule the first visit.
        </p>
        <p className="mt-6 text-sm text-slate">
          Need to change something? You can come back to this page any time using the link in your email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* 1. Parents */}
      <Section
        step={1}
        title="About your parents"
        intro="Your plan covers both parents living at the same address. Health details are optional - share only what you're comfortable with."
      >
        {form.parents.map((p, i) => (
          <div key={i} className={i > 0 ? "border-t border-line pt-6" : ""}>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-ink">{i === 0 ? "Parent 1" : "Parent 2"}</p>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => set("parents", form.parents.slice(0, 1))}
                  className="text-xs font-semibold text-alert"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required={i === 0}>
                <input
                  className={input}
                  required={i === 0}
                  value={p.name}
                  onChange={(e) => setParent(i, "name", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age">
                  <input
                    className={input}
                    inputMode="numeric"
                    maxLength={3}
                    value={p.age}
                    onChange={(e) => setParent(i, "age", e.target.value.replace(/\D/g, ""))}
                  />
                </Field>
                <Field label="Gender">
                  <select className={input} value={p.gender} onChange={(e) => setParent(i, "gender", e.target.value)}>
                    <option value="">-</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
              <Field label="Their phone number" hint="So we can call them directly.">
                <input
                  className={input}
                  inputMode="tel"
                  placeholder="+91"
                  value={p.phone}
                  onChange={(e) => setParent(i, "phone", e.target.value)}
                />
              </Field>
              <Field label="Languages they're comfortable in">
                <input
                  className={input}
                  placeholder="e.g. Hindi, Punjabi"
                  value={p.languages}
                  onChange={(e) => setParent(i, "languages", e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-5 rounded-xl bg-linen/60 p-4">
              <p className="mb-3 text-sm font-semibold text-ink">
                {p.name ? `${p.name.split(" ")[0]}'s health` : "Health"}{" "}
                <span className="font-normal text-slate">(optional)</span>
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Medical conditions">
                  <textarea
                    className={input}
                    rows={2}
                    placeholder="e.g. diabetes, high BP"
                    value={p.conditions}
                    onChange={(e) => setParent(i, "conditions", e.target.value)}
                  />
                </Field>
                <Field label="Current medicines">
                  <textarea
                    className={input}
                    rows={2}
                    placeholder="Name and dose, if you know it"
                    value={p.medicines}
                    onChange={(e) => setParent(i, "medicines", e.target.value)}
                  />
                </Field>
                <Field label="Regular doctor (name & phone)">
                  <input className={input} value={p.doctor} onChange={(e) => setParent(i, "doctor", e.target.value)} />
                </Field>
                <Field label="Mobility, allergies, anything else">
                  <input
                    className={input}
                    placeholder="e.g. uses a walker, allergic to penicillin"
                    value={p.mobility}
                    onChange={(e) => setParent(i, "mobility", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </div>
        ))}
        {form.parents.length < 2 && (
          <button
            type="button"
            onClick={() => set("parents", [...form.parents, { ...EMPTY_PARENT }])}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-ink"
          >
            + Add second parent
          </button>
        )}
      </Section>

      {/* 2. Home */}
      <Section step={2} title="Their home" intro="Where we'll visit, and how we get in.">
        <Field label="Full address" required>
          <textarea
            className={input}
            rows={3}
            required
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" required>
            <input className={input} required value={form.city} onChange={(e) => set("city", e.target.value)} />
          </Field>
          <Field label="PIN code" required>
            <input
              className={input}
              required
              inputMode="numeric"
              maxLength={6}
              pattern="\d{6}"
              value={form.pincode}
              onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
            />
          </Field>
        </div>
        <Field label="Who else lives there or visits regularly?" hint="e.g. house help (name & phone), driver, cook.">
          <input className={input} value={form.livesWith} onChange={(e) => set("livesWith", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Who has a spare key?">
            <input className={input} value={form.keys} onChange={(e) => set("keys", e.target.value)} />
          </Field>
          <Field label="Preferred hospital nearby">
            <input className={input} value={form.hospital} onChange={(e) => set("hospital", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* 3. Emergency contacts */}
      <Section
        step={3}
        title="Local emergency contacts"
        intro="People near your parents we can call first in an emergency - a neighbour, relative or friend."
      >
        {form.contacts.map((c, i) => (
          <div key={i} className="grid gap-4 sm:grid-cols-3">
            <Field label={`Contact ${i + 1} name`} required={i === 0}>
              <input
                className={input}
                required={i === 0}
                value={c.name}
                onChange={(e) => setContact(i, "name", e.target.value)}
              />
            </Field>
            <Field label="Relation">
              <input
                className={input}
                placeholder="e.g. neighbour"
                value={c.relation}
                onChange={(e) => setContact(i, "relation", e.target.value)}
              />
            </Field>
            <Field label="Phone" required={i === 0}>
              <input
                className={input}
                required={i === 0}
                inputMode="tel"
                value={c.phone}
                onChange={(e) => setContact(i, "phone", e.target.value)}
              />
            </Field>
          </div>
        ))}
      </Section>

      {/* 4. Preferences & consent */}
      <Section step={4} title="Your preferences">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Best time to call your parents">
            <input
              className={input}
              placeholder="e.g. after 11 AM, not during lunch"
              value={form.callTime}
              onChange={(e) => set("callTime", e.target.value)}
            />
          </Field>
          <Field label="How often do you want updates?">
            <select className={input} value={form.updates} onChange={(e) => set("updates", e.target.value)}>
              <option>After every call or visit</option>
              <option>Once a week</option>
              <option>Only when something important happens</option>
            </select>
          </Field>
        </div>
        <Field label="Anything we should never do without asking you first?">
          <input
            className={input}
            placeholder="e.g. don't change doctors, call me before any hospital visit"
            value={form.neverWithout}
            onChange={(e) => set("neverWithout", e.target.value)}
          />
        </Field>
        <Field label="Anything else?">
          <textarea className={input} rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>

        <div className="space-y-3 rounded-xl bg-linen p-4">
          <label className="flex items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              required
              checked={consentParents}
              onChange={(e) => setConsentParents(e.target.checked)}
              className="mt-1 accent-[#3A2E22]"
            />
            <span>My parents know about Goodson and are happy for the team to call and visit them.</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              required
              checked={consentData}
              onChange={(e) => setConsentData(e.target.checked)}
              className="mt-1 accent-[#3A2E22]"
            />
            <span>
              I agree that Goodson can store these details, including health information, to look after my parents, as
              described in the{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>
      </Section>

      {error && <p className="rounded-lg bg-alert-soft px-4 py-3 text-sm text-alert">{error}</p>}

      <button
        type="submit"
        disabled={state === "saving"}
        className="w-full rounded-full bg-ink py-4 text-sm font-semibold text-paper hover:opacity-90 disabled:opacity-60"
      >
        {state === "saving" ? "Saving…" : initial ? "Save changes" : "Send details to Goodson"}
      </button>
      <p className="text-center text-xs text-slate">
        Your details are private and only shared with the Goodson team looking after your parents.
      </p>
    </form>
  );
}
