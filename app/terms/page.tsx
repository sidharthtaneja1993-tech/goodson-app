import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Goodson",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="23 October 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of
        Goodson&apos;s website and care coordination services, provided by
        Goodson Ventures Pvt Ltd. By subscribing to or using Goodson, you agree
        to these Terms.
      </p>

      <h2>What Goodson provides</h2>
      <p>
        Goodson coordinates non-medical and logistical support for elderly
        parents in India on behalf of family members, according to the plan you
        choose (Companion, Companion Remote, Guardian or Prestige) and any
        add-ons you book. Depending on your plan, this may include wellbeing
        check-ins, family updates, appointment coordination, home visits,
        escorts, home repair coordination, banking and government errand
        support, and emergency coordination, as described on our pricing page.
        Each plan covers up to two parents living together at the same address.
      </p>

      <h2>Where we operate</h2>
      <p>
        Guardian and Prestige, and on-ground emergency response, are currently
        available in Delhi NCR. Companion Remote is available in other cities,
        with home visits about once every 2 months. Some services may be
        limited or unavailable in remote and rural areas.
      </p>

      <h2>What Goodson is not</h2>
      <p>
        Goodson is not a medical provider, hospital, ambulance service or
        licensed home healthcare agency. Our &quot;emergency response&quot;
        means coordinating help: contacting ambulances, hospitals, doctors,
        local contacts and family, and sending our team where available. We do
        not provide medical diagnosis or treatment. In a medical emergency,
        always contact local emergency services (such as 112) directly as well
        as notifying Goodson.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>
          Provide accurate information about your parent(s), including relevant
          medical information and local emergency contacts
        </li>
        <li>Keep your account details confidential</li>
        <li>Keep your payment method valid if your plan renews automatically</li>
        <li>Respond promptly when we coordinate requests with you</li>
      </ul>

      <h2>Plans, payments and automatic renewal</h2>
      <p>
        You choose a plan length of 1, 3, 6 or 12 months. Every plan renews
        automatically: you authorise us
        (through our payment partner, Razorpay) to charge your payment method at
        the start of each new period until you cancel. We will email a reminder
        before each renewal. Prices are shown on our pricing page; any change
        applies only from your next renewal. Full details are in our{" "}
        <a href="/refund-policy">Cancellation &amp; Refund Policy</a>.
      </p>

      <h2>Cancellation and refunds</h2>
      <p>
        You can cancel automatic renewal at any time on WhatsApp or by email;
        your services continue until the end of the period already paid for.
        Payments are non-refundable except where required by law, as set out in
        our <a href="/refund-policy">Cancellation &amp; Refund Policy</a>.
      </p>

      <h2>Service limitations</h2>
      <p>
        Coordination depends on the availability of our team, caregivers,
        vendors and third-party professionals in your parent&apos;s area, and on
        circumstances outside our control (such as weather, transport
        disruptions or third-party delays). We will make reasonable efforts to
        respond quickly, but cannot guarantee a specific response time in every
        situation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Goodson is not liable for
        indirect, incidental or consequential damages arising from your use of
        our services, or from the acts or omissions of third-party caregivers,
        vendors, hospitals or professionals we coordinate on your behalf, except
        where such damages arise from our own gross negligence or wilful
        misconduct.
      </p>

      <h2>Suspension and termination</h2>
      <p>
        You may cancel at any time as described above. Goodson may pause or end
        services if a payment is not completed within 7 days of its due date, or
        if an account misuses the service or provides false information.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time and will change the
        &quot;Last updated&quot; date above. Continued use of Goodson after an
        update means you accept the revised Terms.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms can be sent to us on WhatsApp or via the
        contact details on our homepage.
      </p>
    </LegalLayout>
  );
}
