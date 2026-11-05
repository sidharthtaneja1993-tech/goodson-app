import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";

// Structured data (schema.org JSON-LD) so Google understands what Goodson is,
// where it operates and how to contact it. Keep these details identical to
// your Google Business Profile — matching name, phone and address helps rankings.
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://goodson.in/#organization",
        name: "Goodson",
        legalName: "Goodson Ventures Pvt Ltd",
        url: "https://goodson.in",
        logo: "https://goodson.in/icon.png",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: WHATSAPP_DISPLAY.replace(/\s/g, ""),
          contactType: "customer service",
          availableLanguage: ["English", "Hindi"],
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://goodson.in/#business",
        name: "Goodson",
        description:
          "Concierge care for elderly parents in Delhi NCR, for NRI families living abroad: medical coordination, hospital escorts, banking and government errands, home management and regular WhatsApp updates.",
        url: "https://goodson.in",
        image: "https://goodson.in/opengraph-image.png",
        telephone: WHATSAPP_DISPLAY.replace(/\s/g, ""),
        priceRange: "$49–$139 per month",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Bestech Business Tower, Sohna Road, Sector 48",
          addressLocality: "Gurugram",
          addressRegion: "HR",
          postalCode: "122018",
          addressCountry: "IN",
        },
        areaServed: [
          { "@type": "City", name: "New Delhi" },
          { "@type": "City", name: "Gurugram" },
          { "@type": "City", name: "Noida" },
          { "@type": "City", name: "Faridabad" },
          { "@type": "City", name: "Ghaziabad" },
        ],
        parentOrganization: { "@id": "https://goodson.in/#organization" },
      },
      {
        "@type": "WebSite",
        "@id": "https://goodson.in/#website",
        url: "https://goodson.in",
        name: "Goodson",
        publisher: { "@id": "https://goodson.in/#organization" },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
