"use client";

// Loads Google Analytics and the Meta Pixel (when their IDs are filled in
// lib/analytics.ts), tracks page changes, and records every WhatsApp click.
// Your own admin and login pages are never tracked.

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, META_PIXEL_ID, trackWhatsAppClick } from "@/lib/analytics";

const EXCLUDED = ["/admin", "/login", "/dashboard"];

export default function SiteTrackers() {
  const pathname = usePathname() || "";
  const excluded = EXCLUDED.some((p) => pathname.startsWith(p));
  const firstLoad = useRef(true);

  // Meta Pixel: count a PageView each time the visitor moves to a new page.
  // (Google Analytics does this by itself.)
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    if (excluded) return;
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("track", "PageView");
  }, [pathname, excluded]);

  // Any click on a wa.me link counts as a WhatsApp contact.
  useEffect(() => {
    if (excluded) return;
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      if (link && link.href.includes("wa.me/")) trackWhatsAppClick(window.location.pathname);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [excluded]);

  if (excluded) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
