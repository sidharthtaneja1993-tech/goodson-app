import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResendClient } from "@/lib/email/resend";
import { confirmationEmail, notificationEmail } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, pincode, plan, billing_cycle, message } = body;

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "name, email, and phone are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").insert({
    name,
    email,
    phone,
    pincode: pincode || null,
    plan: plan || null,
    billing_cycle: billing_cycle || "monthly",
    message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send the confirmation + team notification emails. This never blocks
  // or fails the signup — the lead is already saved in Supabase above,
  // so an email hiccup (or RESEND_API_KEY not being set yet) shouldn't
  // turn into a broken waitlist form for the visitor.
  const resend = getResendClient();
  if (resend) {
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "Goodson <onboarding@resend.dev>";
    const notifyTo = process.env.NOTIFY_EMAIL;
    const details = {
      name,
      email,
      phone,
      pincode,
      plan,
      billing_cycle,
      message,
    };

    const emailJobs = [
      resend.emails.send({
        from: fromAddress,
        to: email,
        ...confirmationEmail(details),
      }),
    ];

    if (notifyTo) {
      emailJobs.push(
        resend.emails.send({
          from: fromAddress,
          to: notifyTo,
          ...notificationEmail(details),
        })
      );
    }

    const results = await Promise.allSettled(emailJobs);
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Waitlist email failed to send:", result.reason);
      }
    }
  } else {
    console.warn(
      "RESEND_API_KEY is not set — skipping waitlist confirmation/notification emails."
    );
  }

  return NextResponse.json({ ok: true });
}
