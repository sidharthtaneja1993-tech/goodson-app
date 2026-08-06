import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Goodson",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="29 July 2026">
      <p>
        Goodson (&quot;Goodson,&quot; &quot;we,&quot; &quot;us&quot;) provides
        concierge care coordination for elderly parents in India, for family
        members based abroad. This policy explains what personal
        information we collect, why, and how it is protected.
      </p>

      <h2>Information we collect</h2>
      <p>We collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account information:</strong> your name, email address, and
          password, when you sign up for a Goodson account.
        </li>
        <li>
          <strong>Contact and enquiry information:</strong> your name, email,
          WhatsApp number, and any message you send us, when you submit an
          enquiry or get-started form.
        </li>
        <li>
          <strong>Information about your parent(s):</strong> name, age,
          gender, phone number, address, city, PIN code, emergency contact
          details, and medical notes (such as conditions, medications,
          allergies, or mobility needs) that you choose to provide, so that
          our team can coordinate appropriate care.
        </li>
        <li>
          <strong>Usage information:</strong> basic, aggregated analytics
          about how the website is used (such as which pages are visited),
          which does not identify you personally.
        </li>
      </ul>

      <h2>How we use this information</h2>
      <ul>
        <li>To create and manage your account and dashboard</li>
        <li>To coordinate care visits, medical appointments, and requests for your parent(s)</li>
        <li>To communicate with you about your plan, your parent&apos;s care, and billing</li>
        <li>To respond to enquiries and improve our services</li>
        <li>To meet legal, tax, and regulatory obligations</li>
      </ul>

      <h2>Medical and sensitive information</h2>
      <p>
        Any medical notes you provide about your parent(s) are used solely to
        help our care team respond appropriately in day-to-day coordination
        and emergencies. Access to this information is restricted to your own
        account and Goodson&apos;s authorized administrators — it is not
        shared with third parties except where necessary to arrange care
        (for example, with a treating hospital, at your direction) or where
        required by law.
      </p>

      <h2>How your information is stored and secured</h2>
      <p>
        Your data is stored with Supabase, a hosted database provider, using
        access controls that ensure you can only see your own account and
        your own parent&apos;s records, and that only authorized Goodson
        administrators can see customer data across accounts. Passwords are
        never stored in plain text.
      </p>

      <h2>Sharing your information</h2>
      <p>
        We do not sell your personal information. We may share information
        with:
      </p>
      <ul>
        <li>Caregivers, drivers, or vendors we coordinate directly to fulfil a specific request you&apos;ve made</li>
        <li>Payment processors, to handle billing for your plan</li>
        <li>Authorities, where required by law</li>
      </ul>

      <h2>Your choices</h2>
      <p>
        You can review or update your parent&apos;s details anytime from your
        dashboard. To request deletion of your account or your parent&apos;s
        data, contact us on WhatsApp or by email, and we will act on that
        request except where we are required to retain information for
        legal or tax purposes.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will update the
        &quot;Last updated&quot; date above when we do.
      </p>

      <h2>Contact us</h2>
      <p>
        For any questions about this policy or your data, reach out to us on
        WhatsApp or via the contact details on our homepage.
      </p>
    </LegalLayout>
  );
}
