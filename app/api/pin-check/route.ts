import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get("pincode");

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "invalid pincode" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("serviceable_pincodes")
    .select("pincode")
    .eq("pincode", pincode)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ covered: !!data });
}
