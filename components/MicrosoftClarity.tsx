'use client';

// Microsoft Clarity (session recordings + heatmaps) for goodson.in
// Paste your Clarity project ID below. Until it is filled in, nothing loads.

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const CLARITY_ID = 'z7tth9f79i';

// Pages we never record (your own admin area and login)
const EXCLUDED = ['/admin', '/login', '/dashboard'];

export default function MicrosoftClarity() {
  const pathname = usePathname() || '';
  const isExcluded = EXCLUDED.some((p) => pathname.startsWith(p));

  if (!CLARITY_ID || isExcluded) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}
