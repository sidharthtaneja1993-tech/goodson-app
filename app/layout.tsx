import RedditPixel from '@/components/RedditPixel';
import MicrosoftClarity from '@/components/MicrosoftClarity';
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/lora/400.css";
import "@fontsource/lora/500.css";
import "@fontsource/lora/600.css";
import "@fontsource/lora/700.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/500.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import StructuredData from "@/components/StructuredData";
import SiteTrackers from "@/components/SiteTrackers";

const SITE_TITLE = "Goodson — Care for elderly parents in Delhi NCR, for NRIs abroad";
const SITE_DESCRIPTION =
  "For NRIs abroad: a trusted team caring for your elderly parents in Delhi, Gurugram & NCR. Doctor visits, hospital escorts, bank errands, home help and WhatsApp updates.";

export const metadata: Metadata = {
  metadataBase: new URL("https://goodson.in"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "elderly parent care Delhi",
    "NRI parent care India",
    "senior care Delhi NCR",
    "care for parents in India while abroad",
    "elder care Gurugram",
    "concierge for elderly parents",
  ],
  // Optional: paste the code from Google Search Console's "HTML tag" method
  // into NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel. Not needed if you
  // verify with the DNS method instead.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: "Goodson — Miles away. Never out of reach.",
    description:
      "A trusted team on the ground for your parents in India, with 24×7 emergency response. For less than a coffee a day.",
    url: "https://goodson.in",
    siteName: "Goodson",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goodson — Miles away. Never out of reach.",
    description:
      "A trusted team on the ground for your parents in India, with 24×7 emergency response.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
      <StructuredData />
      <RedditPixel />
      <MicrosoftClarity />
      <SiteTrackers />
        {children}
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
