import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rzp } from "@/lib/razorpay";

// Admin-only: stops a subscription from renewing. Service continues until the
// end of the period the family has already paid for.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url), 303);

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  const form = await req.formData();
  const subscriptionId = String(form.get("subscription_id") || "");
  const db = createAdminClient();
  if (!subscriptionId || !db) return NextResponse.redirect(new URL("/admin?cancel=error", req.url), 303);

  try {
    await rzp("POST", `/subscriptions/${subscriptionId}/cancel`, { cancel_at_cycle_end: 1 });
    await db
      .from("subscriptions")
      .update({ cancel_requested: true, updated_at: new Date().toISOString() })
      .eq("razorpay_subscription_id", subscriptionId);
    return NextResponse.redirect(new URL("/admin?cancel=ok", req.url), 303);
  } catch (e) {
    console.error("Cancel failed:", e);
    return NextResponse.redirect(new URL("/admin?cancel=error", req.url), 303);
  }
}
