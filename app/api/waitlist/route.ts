import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResendClient } from "@/lib/email/resend";
import { notificationEmail } from "@/lib/email/templates";
import { getPlan, getTerm, termLabel, termTotalUSD } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, pincode, plan, billing_cycle, message } = body;

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "name, email, and phone are required" },
      { status: 400 }
    );
  }

  // Work out the price on the server too, so the stored amount can't be tampered with.
  const planInfo = getPlan(plan);
  const termInfo = getTerm(billing_cycle);
  const amountUsd =
    planInfo && termInfo ? termTotalUSD(planInfo.monthly, termInfo) : null;

  const supabase = await createClient();
  const row = {
    name,
    email,
    phone,
    pincode: pincode || null,
    plan: planInfo ? planInfo.id : null,
    billing_cycle: termInfo ? termInfo.id : billing_cycle || "1_month",
    message: message || null,
  };
  let { error } = await supabase.from("waitlist").insert(row);

  // Safety net: if the database hasn't been updated yet to allow the new
  // 1/3/6/12-month values (supabase/migrations/002_subscription_terms.sql),
  // save the lead anyway with the term written into the message.
  if (error?.code === "23514") {
    console.warn("billing_cycle constraint not migrated yet; saving term in message.");
    ({ error } = await supabase.from("waitlist").insert({
      ...row,
      billing_cycle: termInfo?.months === 12 ? "annual" : "monthly",
      message: `[Term: ${termLabel(row.billing_cycle)}${
        amountUsd ? `, $${amountUsd}` : ""
      }] ${message || ""}`.trim(),
    }));
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Tell the team someone started checkout. The customer gets no email here:
  // they're about to pay, and the payment receipt is their confirmation.
  // If they don't pay, the daily job (api/cron/renewal-reminders) sends them
  // one friendly follow-up the next day.
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
      billing_cycle: row.billing_cycle,
      amount_usd: amountUsd,
      message,
    };

    const emailJobs: Promise<unknown>[] = [];

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
