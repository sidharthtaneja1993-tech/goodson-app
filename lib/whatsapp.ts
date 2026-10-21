// Goodson's WhatsApp number. Change it here and it updates everywhere on the site.
export const WHATSAPP_NUMBER = "919643801170"; // country code + number, no "+" or spaces
export const WHATSAPP_DISPLAY = "+91 96438 01170";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
