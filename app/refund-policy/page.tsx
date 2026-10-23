import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — Goodson",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Cancellation & Refund Policy" updated="23 October 2026">
      <p>
        This policy explains how payments, automatic renewals and cancellations
        work for all Goodson plans (Companion, Companion Remote, Guardian and
        Prestige) and add-ons.
      </p>

      <h2>How you pay</h2>
      <p>
        When you subscribe, you choose a plan length of 1, 3, 6 or 12 months.
        You are charged for that length now, and the same amount is charged
        automatically at the start of each new period (every month, 3 months, 6
        months or year) until you cancel.
      </p>
      <p>
        All payments are made in advance and processed securely by our payment
        partner, Razorpay.
      </p>

      <h2>Renewal reminders</h2>
      <p>
        If your plan renews automatically, we will email you a reminder about
        3 days before each renewal, showing the date and amount.
      </p>

      <h2>Cancelling</h2>
      <p>
        You can cancel automatic renewal at any time by messaging us on
        WhatsApp or emailing us. Once cancelled:
      </p>
      <ul>
        <li>You will not be charged again.</li>
        <li>
          Your plan and its services continue until the end of the period you
          have already paid for.
        </li>
      </ul>
      <p>
        To avoid the next charge, please cancel before your renewal date.
      </p>

      <h2>No refunds</h2>
      <p>
        Payments for any plan length, renewals and add-ons are non-refundable,
        including for unused days, visits or months within a period that has
        already started, except where required by applicable law.
      </p>

      <h2>If we don&apos;t deliver</h2>
      <p>
        If we fail to deliver a service you have paid for because of an error
        on our part (for example, a scheduled visit that did not happen), tell
        us and we will make it right by arranging the service as soon as
        possible or adding an equivalent credit to your plan.
      </p>

      <h2>Failed renewal payments</h2>
      <p>
        If an automatic renewal payment fails (for example, an expired card),
        our payment partner may retry it. If payment is not completed within
        7 days of the renewal date, your services will be paused until payment
        is made or you choose a new plan.
      </p>

      <h2>Companion Remote</h2>
      <p>
        Companion Remote is for parents outside Delhi NCR. Some services, such
        as home visits, lab tests at home and fast emergency support, may be
        limited or unavailable in remote and rural areas. This does not entitle
        you to a refund.
      </p>

      <h2>Add-ons</h2>
      <p>
        Add-ons (such as extra visits, escorts or festival visits) are paid
        separately when booked and are non-refundable once the service has
        been delivered or the visit has been scheduled.
      </p>

      <h2>Price changes</h2>
      <p>
        If our prices change, we will tell you before your next renewal. The
        new price applies only from your next renewal, never to a period you
        have already paid for.
      </p>

      <h2>Contact</h2>
      <p>
        To cancel or ask about a payment, message us on WhatsApp or email us
        with the email address you used to subscribe.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time and will change the
        &quot;Last updated&quot; date above when we do. Changes will not apply
        to a period you have already paid for.
      </p>
    </LegalLayout>
  );
}
