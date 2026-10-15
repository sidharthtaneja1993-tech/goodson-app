export type WaitlistDetails = {
  name: string;
  email: string;
  phone: string;
  pincode?: string | null;
  plan?: string | null;
  billing_cycle?: string | null;
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

/** Sent to the person who joined the waitlist. */
export function confirmationEmail(d: WaitlistDetails) {
  const planLine = d.plan
    ? `<p style="margin:0 0 16px;">Plan selected: <strong style="text-transform:capitalize;">${escapeHtml(
        d.plan
      )}</strong> · ${d.billing_cycle === "annual" ? "Annual" : "Monthly"}</p>`
    : "";

  return {
    subject: "You're on the Goodson waitlist",
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:22px;color:${brand.ink};">You're on the list, ${escapeHtml(
      d.name
    )}.</h1>
      <p style="margin:0 0 16px;">Thank you for your interest in Goodson. We've saved your details and will reach out on WhatsApp at <strong>${escapeHtml(
        d.phone
      )}</strong> to confirm your parents' details and get you set up.</p>
      ${planLine}
      <p style="margin:0;">If anything changes in the meantime, just reply to this email.</p>
    `),
  };
}

/** Sent to the Goodson team when someone joins the waitlist. */
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
    subject: `New waitlist signup: ${d.name}`,
    html: wrap(`
      <h1 style="margin:0 0 16px;font-size:20px;color:${brand.ink};">New waitlist signup</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;font-family:Arial,sans-serif;">
        ${row("Name", d.name)}
        ${row("Email", d.email)}
        ${row("Phone", d.phone)}
        ${row("PIN code", d.pincode)}
        ${row(
          "Plan",
          d.plan
            ? `${d.plan} (${d.billing_cycle === "annual" ? "annual" : "monthly"})`
            : null
        )}
        ${row("Message", d.message)}
      </table>
    `),
  };
}
