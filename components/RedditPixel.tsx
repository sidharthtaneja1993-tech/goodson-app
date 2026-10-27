'use client';

// Reddit Pixel for goodson.in
// Put this file at: components/RedditPixel.tsx
// Then add <RedditPixel /> inside <body> in app/layout.tsx

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PIXEL_ID = 'a2_jx7ibeomeovq';

export default function RedditPixel() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);
  const isAdmin = pathname?.startsWith('/admin');

  // Track a PageVisit each time the visitor moves to a new page
  // (the very first visit is tracked by the script below)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (isAdmin) return;
    const rdt = (window as any).rdt;
    if (typeof rdt === 'function') rdt('track', 'PageVisit');
  }, [pathname, isAdmin]);

  // Don't track your own admin pages
  if (isAdmin) return null;

  return (
    <Script id="reddit-pixel" strategy="afterInteractive">
      {`
        !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
        rdt('init', '${PIXEL_ID}');
        rdt('track', 'PageVisit');
      `}
    </Script>
  );
}
