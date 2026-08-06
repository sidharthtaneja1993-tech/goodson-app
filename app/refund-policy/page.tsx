import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Goodson",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" updated="29 July 2026">
      <p>
        This policy explains how cancellations, refunds, and billing changes
        work for Goodson plans (Companion, Guardian, and Prestige).
      </p>

      <h2>Cancelling your plan</h2>
      <p>
        You may cancel your plan at any time by messaging us on WhatsApp or
        emailing us. Cancellations take effect at the end of your current
        billing period (monthly or annual) — you will continue to have
        access to your plan&apos;s services until that date, with no further
        charges afterward.
      </p>

      <h2>Monthly plans</h2>
      <p>
        Monthly plans are billed in advance for each 30-day period. We do
        not provide partial refunds for unused days within a billing period
        that has already started, except where required by law or at
        Goodson&apos;s discretion in cases of service failure on our part.
      </p>

      <h2>Annual plans</h2>
      <p>
        Annual plans are billed in advance for a 12-month period. If you
        cancel an annual plan:
      </p>
      <ul>
        <li>Within the first 7 days of the annual billing period, you may request a full refund.</li>
        <li>
          After the first 7 days, we will refund the unused portion of your
          annual plan on a pro-rata basis, calculated from the date we
          receive your cancellation request, less any discount applied for
          choosing the annual plan.
        </li>
      </ul>

      <h2>Refunds for service issues</h2>
      <p>
        If we fail to deliver a service you have paid for under your plan
        (for example, a scheduled visit that did not occur due to an error
        on our part), contact us and we will make it right — either by
        arranging the service, crediting your account, or issuing a partial
        refund, depending on the situation.
      </p>

      <h2>How refunds are processed</h2>
      <p>
        Approved refunds are issued to the original payment method used at
        checkout, and are typically processed within 7–10 business days by
        our payment provider.
      </p>

      <h2>Requesting a cancellation or refund</h2>
      <p>
        To cancel your plan or request a refund, message us on WhatsApp or
        email us with your account email and the reason for your request.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will update the
        &quot;Last updated&quot; date above when we do. Changes will not
        apply retroactively to a billing period you have already paid for
        under the previous policy.
      </p>
    </LegalLayout>
  );
}
