// Helper to send Reddit Pixel events from anywhere on the site
// Put this file at: lib/redditPixel.ts
// Use it like: trackReddit('Purchase', { value: 100, currency: 'USD', conversionId: paymentId })

type RedditEvent =
  | 'PageVisit'
  | 'ViewContent'
  | 'Lead'
  | 'SignUp'
  | 'AddToCart'
  | 'Purchase'
  | 'Custom';

export function trackReddit(event: RedditEvent, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const rdt = (window as any).rdt;
  if (typeof rdt !== 'function') return;
  if (data) {
    rdt('track', event, data);
  } else {
    rdt('track', event);
  }
}
