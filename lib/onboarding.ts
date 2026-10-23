import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const SITE_URL = "https://goodson.in";

export function onboardingUrl(token: string) {
  return `${SITE_URL}/onboarding/${token}`;
}

/**
 * Creates (once) the private parents'-details link for a payment or
 * subscription and returns its token. Safe to call repeatedly.
 */
export async function ensureIntake(input: {
  ref: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  plan?: string | null;
  term?: string | null;
}): Promise<string | null> {
  const db = createAdminClient();
  if (!db) return null;

  const { data: existing } = await db
    .from("parent_intakes")
    .select("token")
    .eq("ref", input.ref)
    .maybeSingle();
  if (existing?.token) return existing.token as string;

  const token = crypto.randomBytes(18).toString("base64url");
  const { error } = await db.from("parent_intakes").insert({
    token,
    ref: input.ref,
    name: input.name ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    plan: input.plan ?? null,
    term: input.term ?? null,
  });
  if (error) {
    // Another request may have created it at the same moment - read it back.
    const { data: again } = await db.from("parent_intakes").select("token").eq("ref", input.ref).maybeSingle();
    return (again?.token as string) ?? null;
  }
  return token;
}

/** Field limits for the form - keeps stored data tidy. */
export function clean(v: unknown, max = 500) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export type ParentInfo = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  languages: string;
  conditions: string;
  medicines: string;
  doctor: string;
  mobility: string;
};

export type IntakeData = {
  parents: ParentInfo[];
  address: string;
  city: string;
  pincode: string;
  livesWith: string;
  keys: string;
  hospital: string;
  contacts: { name: string; relation: string; phone: string }[];
  callTime: string;
  updates: string;
  neverWithout: string;
  notes: string;
};
