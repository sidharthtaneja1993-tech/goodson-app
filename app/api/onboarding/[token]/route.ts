import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clean, type IntakeData } from "@/lib/onboarding";
import { getResendClient } from "@/lib/email/resend";
import { intakeNotificationEmail } from "@/lib/email/templates";
import { planName, termLabel } from "@/lib/plans";

// Saves the parents' details form. The private token in the URL is the
// only key, so nothing else about the customer can be read or changed.
export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const db = createAdminClient();
  if (!db || !token) return NextResponse.json({ error: "Not available" }, { status: 503 });

  const { data: intake } = await db.from("parent_intakes").select("*").eq("token", token).maybeSingle();
  if (!intake) return NextResponse.json({ error: "This link is not valid" }, { status: 404 });

  const body = await req.json();
  const parents = (Array.isArray(body.parents) ? body.parents : [])
    .slice(0, 2)
    .map((p: Record<string, unknown>) => ({
      name: clean(p.name, 120),
      age: clean(p.age, 3),
      gender: clean(p.gender, 20),
      phone: clean(p.phone, 30),
      languages: clean(p.languages, 120),
      conditions: clean(p.conditions, 1500),
      medicines: clean(p.medicines, 1500),
      doctor: clean(p.doctor),
      mobility: clean(p.mobility),
    }))
    .filter((p: { name: string }) => p.name);
  const contacts = (Array.isArray(body.contacts) ? body.contacts : [])
    .slice(0, 2)
    .map((c: Record<string, unknown>) => ({
      name: clean(c.name, 120),
      relation: clean(c.relation, 60),
      phone: clean(c.phone, 30),
    }))
    .filter((c: { name: string; phone: string }) => c.name && c.phone);

  const data: IntakeData = {
    parents,
    address: clean(body.address, 400),
    city: clean(body.city, 80),
    pincode: clean(body.pincode, 6),
    livesWith: clean(body.livesWith),
    keys: clean(body.keys),
    hospital: clean(body.hospital),
    contacts,
    callTime: clean(body.callTime, 120),
    updates: clean(body.updates, 60),
    neverWithout: clean(body.neverWithout),
    notes: clean(body.notes, 1500),
  };

  if (!parents.length || !data.address || !/^\d{6}$/.test(data.pincode) || !contacts.length) {
    return NextResponse.json({ error: "Please fill in the required fields" }, { status: 400 });
  }
  if (body.consentParents !== true || body.consentData !== true) {
    return NextResponse.json({ error: "Please tick both consent boxes" }, { status: 400 });
  }

  const firstTime = intake.status !== "submitted";
  const { error } = await db
    .from("parent_intakes")
    .update({
      data,
      status: "submitted",
      submitted_at: intake.submitted_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", intake.id);
  if (error) return NextResponse.json({ error: "Could not save - please try again" }, { status: 500 });

  const resend = getResendClient();
  if (resend && process.env.NOTIFY_EMAIL) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Goodson <onboarding@resend.dev>",
        to: process.env.NOTIFY_EMAIL,
        ...intakeNotificationEmail({
          updated: !firstTime,
          customer: intake.name,
          email: intake.email,
          phone: intake.phone,
          plan: `${planName(intake.plan)} (${termLabel(intake.term)})`,
          data,
        }),
      });
    } catch (e) {
      console.error("Intake email failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
