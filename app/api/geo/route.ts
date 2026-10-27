import { NextRequest, NextResponse } from "next/server";

// Tells the browser which country the visitor is in, so prices can be shown
// in their currency. Vercel adds the x-vercel-ip-country header on every request.
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") || null;
  return NextResponse.json({ country }, { headers: { "Cache-Control": "no-store" } });
}
