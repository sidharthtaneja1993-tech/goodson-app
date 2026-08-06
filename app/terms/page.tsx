import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Goodson",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="29 July 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of
        Goodson&apos;s website and care coordination services. By signing up
        for or using Goodson, you agree to these Terms.
      </p>

      <h2>What Goodson provides</h2>
      <p>
        Goodson coordinates non-medical and logistical support for elderly
        parents in India on behalf of family members based abroad, according
        to the plan you subscribe to (Companion, Guardian, or Prestige).
        Depending on your plan, this may include wellbeing check-ins,
        appointment coordination, escorts, home repair coordination, banking
        and government errand support, and related services, as described on
        our pricing page.
      </p>

      <h2>What Goodson is not</h2>
      <p>
        Goodson is not a medical provider, hospital, ambulance service, or
        licensed home healthcare agency. We coordinate and arrange access to
        third-party medical and other professionals; we do not ourselves
        provide medical diagnosis, treatment, or emergency medical response.
        In a medical emergency, always contact local emergency services
        directly in addition to notifying Goodson.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Provide accurate information about your parent(s), including relevant medical information, to help our team respond appropriately</li>
        <li>Keep your account credentials confidential</li>
        <li>Pay for your selected plan on time</li>
        <li>Communicate promptly with our team when coordinating requests</li>
      </ul>

      <h2>Plans and billing</h2>
      <p>
        Plans are billed monthly or annually as selected at signup. Prices
        are listed on our pricing page and may change from time to time;
        changes will not apply retroactively to a billing period you have
        already paid for. See our{" "}
        <a href="/refund-policy">Refund &amp; Cancellation Policy</a> for
        details on cancelling or requesting a refund.
      </p>

      <h2>Service limitations</h2>
      <p>
        Coordination is subject to the availability of caregivers, vendors,
        and third-party professionals in your parent&apos;s area, and to
        circumstances outside our control (such as weather, transport
        disruptions, or third-party delays). We will make reasonable efforts
        to meet response times appropriate to your plan, but cannot
        guarantee a specific response time in every circumstance.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Goodson is not liable for
        indirect, incidental, or consequential damages arising from your use
        of our services, or from the acts or omissions of third-party
        caregivers, vendors, or professionals we coordinate on your behalf,
        except where such damages arise from our own gross negligence or
        wilful misconduct.
      </p>

      <h2>Termination</h2>
      <p>
        You may cancel your plan at any time as described in our{" "}
        <a href="/refund-policy">Refund &amp; Cancellation Policy</a>.
        Goodson may suspend or terminate an account that misuses the
        service, provides fraudulent information, or fails to pay for a
        selected plan.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of
        Goodson after an update constitutes acceptance of the revised Terms.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms can be sent to us on WhatsApp or via the
        contact details on our homepage.
      </p>
    </LegalLayout>
  );
}
