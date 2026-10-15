import { Resend } from "resend";

/**
 * Returns a Resend client, or null if RESEND_API_KEY isn't configured.
 * Kept optional (rather than throwing) so the waitlist API route still
 * works — and the lead still lands in Supabase — even before email
 * sending is wired up in an environment.
 */
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}
