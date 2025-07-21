'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function GoogleAnalytics() {
    const gtmId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const pathname = usePathname();

    useEffect(() => {
        if (pathname && gtmId) {
            const url = pathname + window.location.search;
            if (window.gtag) {
                window.gtag('config', gtmId, {
                    page_path: url,
                });
            }
        }
    }, [pathname, gtmId]);

    if (!gtmId) {
        console.warn("Google Analytics Measurement ID is not set. Tracking will be disabled.");
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gtmId}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('consent', 'default', {
                            'ad_storage': 'denied',
                            'analytics_storage': 'denied'
                        });
                        gtag('config', '${gtmId}');
                    `,
                }}
            />
        </>
    );
}
