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

const SITE_TITLE = "Goodson — Premium concierge care for your parents in India";
const SITE_DESCRIPTION =
  "For NRIs abroad: dedicated concierge care for your parents in India. Medical coordination, home management, and daily support — updates you can trust.";

export const metadata: Metadata = {
  metadataBase: new URL("https://goodson.in"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
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
        {children}
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
