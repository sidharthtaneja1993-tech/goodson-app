import type { MetadataRoute } from "next";

// Served at https://goodson.in/robots.txt
// Lets Google crawl the public site, keeps private/admin pages out of search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/login", "/signup", "/onboarding", "/auth", "/api"],
    },
    sitemap: "https://goodson.in/sitemap.xml",
    host: "https://goodson.in",
  };
}
