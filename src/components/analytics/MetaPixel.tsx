"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import {
  META_PIXEL_ID,
  isMetaPixelExcludedPath,
  trackMetaPageView,
} from "@/lib/meta-pixel";

export function MetaPixel() {
  const { marketingAllowed } = useCookieConsent();
  const pathname = usePathname();
  const skipNextPageView = useRef(true);
  const isExcluded = isMetaPixelExcludedPath(pathname);

  useEffect(() => {
    if (!marketingAllowed || isExcluded) {
      skipNextPageView.current = true;
      return;
    }
    if (skipNextPageView.current) {
      skipNextPageView.current = false;
      return;
    }
    trackMetaPageView();
  }, [pathname, marketingAllowed, isExcluded]);

  if (!marketingAllowed || isExcluded) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          className="hidden"
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
