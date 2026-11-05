import type { MetadataRoute } from "next";

// Tells Google which public pages exist. Served at https://goodson.in/sitemap.xml
// Add a line here whenever you add a new public page (e.g. a guide or blog post).
const BASE = "https://goodson.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/keys`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/updates`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
