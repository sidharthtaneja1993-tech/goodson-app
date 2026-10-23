import { planName, termLabel } from "@/lib/plans";

export type WaitlistDetails = {
  name: string;
  email: string;
  phone: string;
  pincode?: string | null;
  plan?: string | null;
  billing_cycle?: string | null;
  amount_usd?: number | null;
  message?: string | null;
};

// Mirrors the design tokens in app/globals.css (cream & antique gold palette).
const brand = {
  ink: "#3A2E22",
  linen: "#F1E4CC",
  paper: "#FBF5E9",
  marigold: "#C9A227",
  slate: "#7A6A50",
  charcoal: "#2E2418",
  line: "#E3D3B0",
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrap(bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${brand.linen};font-family:Georgia,'Lora',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.linen};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${brand.paper};border-radius:16px;overflow:hidden;border:1px solid ${brand.line};">
            <tr>
              <td style="background:${brand.ink};padding:24px 32px;">
                <span style="color:${brand.marigold};font-size:20px;font-weight:600;letter-spacing:0.02em;">Goodson</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:${brand.charcoal};font-size:15px;line-height:1.6;font-family:Georgia,'Lora',serif;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid ${brand.line};color:${brand.slate};font-size:12px;font-family:Arial,sans-serif;">
                Goodson — premium care coordination for parents in India.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Sent to the person who submitted the Subscribe form. */
export function confirmationEmail(d: WaitlistDetails) {
  const planLine = d.plan
    ? `<p style="margin:0 0 16px;">Plan selected: <strong>${escapeHtml(
        planName(d.plan)
      )}</strong> · ${escapeHtml(termLabel(d.billing_cycle))}${
        d.amount_usd ? ` · $${d.amount_usd} total` : ""
      }</p>`
    : "";

  return {
    subject: "Your Goodson subscription request",
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:22px;color:${brand.ink};">Thank you, ${escapeHtml(d.name)}.</h1>
      <p style="margin:0 0 16px;">We've received your Goodson subscription request. Our team will contact you on WhatsApp at <strong>${escapeHtml(
        d.phone
      )}</strong> or by email to collect your parents' details and get their care set up.</p>
      ${planLine}
      <p style="margin:0;">If anything changes in the meantime, just reply to this email.</p>
    `),
  };
}

/** Sent to the Goodson team when someone submits the Subscribe form. */
export function notificationEmail(d: WaitlistDetails) {
  const row = (label: string, value?: string | null) =>
    value
      ? `<tr><td style="padding:4px 12px 4px 0;color:${
          brand.slate
        };width:120px;vertical-align:top;">${label}</td><td style="padding:4px 0;color:${
          brand.charcoal
        };">${escapeHtml(value)}</td></tr>`
      : "";

  return {
    subject: `New subscription request: ${d.name}`,
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:20px;color:${brand.ink};">New subscription request</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;font-family:Arial,sans-serif;">
        ${row("Name", d.name)}
        ${row("Email", d.email)}
        ${row("Phone", d.phone)}
        ${row("PIN code", d.pincode)}
        ${row(
          "Plan",
          d.plan
            ? `${planName(d.plan)} (${termLabel(d.billing_cycle)})${
                d.amount_usd ? ` · $${d.amount_usd}` : ""
              }`
            : null
        )}
        ${row("Message", d.message)}
      </table>
    `),
  };
}

export type PaymentDetails = {
  name: string;
  email: string;
  phone: string;
  plan: string;
  term: string;
  amount: string;
  paymentId: string;
  note?: string;
};

/** Sent to the customer after a successful Razorpay payment. */
export function paymentReceivedEmail(d: PaymentDetails) {
  return {
    subject: `Payment received – Goodson ${d.plan}`,
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:22px;color:${brand.ink};">Thank you, ${escapeHtml(d.name)}.</h1>
      <p style="margin:0 0 16px;">We've received your payment of <strong>${escapeHtml(d.amount)}</strong> for the <strong>${escapeHtml(
        d.plan
      )}</strong> plan (${escapeHtml(d.term)}).</p>
      <p style="margin:0 0 16px;">Our team will message you on WhatsApp at <strong>${escapeHtml(
        d.phone
      )}</strong> to schedule your onboarding call and first visit.</p>
      ${d.note ? `<p style="margin:0 0 16px;">${escapeHtml(d.note)}</p>` : ""}
      <p style="margin:0;color:${brand.slate};font-size:13px;">Payment reference: ${escapeHtml(d.paymentId)}</p>
    `),
  };
}

/** Sent to the customer when an auto-renewal payment goes through. */
export function renewalChargedEmail(d: PaymentDetails & { every: string; nextDate: string | null }) {
  return {
    subject: `Your Goodson ${d.plan} plan has renewed`,
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:22px;color:${brand.ink};">Thank you, ${escapeHtml(d.name)}.</h1>
      <p style="margin:0 0 16px;">Your <strong>${escapeHtml(d.plan)}</strong> plan has renewed for another ${escapeHtml(
        d.every
      )}. We've received <strong>${escapeHtml(d.amount)}</strong>.</p>
      ${
        d.nextDate
          ? `<p style="margin:0 0 16px;">Next renewal: <strong>${escapeHtml(d.nextDate)}</strong>.</p>`
          : ""
      }
      <p style="margin:0 0 16px;">Want to change or cancel your plan? Just message us on WhatsApp.</p>
      <p style="margin:0;color:${brand.slate};font-size:13px;">Payment reference: ${escapeHtml(d.paymentId)}</p>
    `),
  };
}

/** Sent to the customer a few days before an automatic renewal. */
export function renewalReminderEmail(d: {
  name: string;
  plan: string;
  every: string;
  amount: string;
  date: string;
}) {
  return {
    subject: `Reminder: your Goodson plan renews on ${d.date}`,
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:22px;color:${brand.ink};">Hi ${escapeHtml(d.name)},</h1>
      <p style="margin:0 0 16px;">A quick reminder that your <strong>${escapeHtml(d.plan)}</strong> plan renews automatically on <strong>${escapeHtml(
        d.date
      )}</strong> for <strong>${escapeHtml(d.amount)}</strong>, covering the next ${escapeHtml(d.every)}.</p>
      <p style="margin:0 0 16px;">There's nothing you need to do. If you'd like to change or cancel your plan, just message us on WhatsApp before that date.</p>
    `),
  };
}

/** Sent to the Goodson team when a subscription fails to renew or is cancelled. */
export function subscriptionAlertEmail(d: {
  status: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  term: string;
}) {
  const label =
    d.status === "cancelled"
      ? "Subscription cancelled"
      : d.status === "halted"
        ? "Renewal failed - subscription paused"
        : "Renewal payment failed - Razorpay is retrying";
  return {
    subject: `⚠️ ${label}: ${d.name}`,
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:20px;color:${brand.ink};">${escapeHtml(label)}</h1>
      <p style="margin:0 0 8px;"><strong>${escapeHtml(d.name)}</strong> · ${escapeHtml(d.email)} · ${escapeHtml(d.phone)}</p>
      <p style="margin:0 0 8px;">${escapeHtml(d.plan)} · ${escapeHtml(d.term)}</p>
      <p style="margin:0;color:${brand.slate};font-size:13px;">Consider a quick WhatsApp to the family.</p>
    `),
  };
}

/** Sent to the Goodson team after a successful payment. */
export function paymentNotificationEmail(d: PaymentDetails) {
  return {
    subject: `💰 Paid: ${d.name} – ${d.plan} (${d.term}) – ${d.amount}`,
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:20px;color:${brand.ink};">New payment received</h1>
      <p style="margin:0 0 8px;"><strong>${escapeHtml(d.name)}</strong> · ${escapeHtml(d.email)} · ${escapeHtml(d.phone)}</p>
      <p style="margin:0 0 8px;">${escapeHtml(d.plan)} · ${escapeHtml(d.term)} · <strong>${escapeHtml(d.amount)}</strong></p>
      <p style="margin:0;color:${brand.slate};font-size:13px;">Razorpay payment: ${escapeHtml(d.paymentId)}</p>
    `),
  };
}
