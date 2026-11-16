// Tracking IDs and conversion events for goodson.in
//
// Paste your IDs below. While an ID is empty, that tracker simply doesn't load.
//   GA_ID          → Google Analytics "Measurement ID" (starts with G-)
//   META_PIXEL_ID  → Meta Pixel ID from Meta Events Manager (a long number)
export const GA_ID = "G-53JBGET712";
export const META_PIXEL_ID = "";

import { trackReddit } from "@/lib/redditPixel";

type Money = { value: number; currency?: string };

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const g = (window as any).gtag;
  if (typeof g === "function") g(...args);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const f = (window as any).fbq;
  if (typeof f === "function") f(...args);
}

// Picked a plan and moved on to the details step.
export function trackAddToCart({ value, currency = "USD" }: Money) {
  trackReddit("AddToCart", { value, currency, itemCount: 1 });
  gtag("event", "add_to_cart", { value, currency });
  fbq("track", "AddToCart", { value, currency });
}

// Filled in their details (name, email, phone) — a real lead.
export function trackLead({ value, currency = "USD" }: Money) {
  trackReddit("Lead", { value, currency });
  gtag("event", "generate_lead", { value, currency });
  fbq("track", "Lead", { value, currency });
}

// Verified, real payment.
export function trackPurchase({ value, currency = "USD", paymentId }: Money & { paymentId: string }) {
  trackReddit("Purchase", { value, currency, itemCount: 1, conversionId: paymentId });
  gtag("event", "purchase", { value, currency, transaction_id: paymentId });
  fbq("track", "Purchase", { value, currency }, { eventID: paymentId });
}

// Clicked any WhatsApp link on the site.
export function trackWhatsAppClick(page: string) {
  trackReddit("Custom", { customEventName: "WhatsAppClick" });
  gtag("event", "whatsapp_click", { page });
  fbq("track", "Contact");
}
