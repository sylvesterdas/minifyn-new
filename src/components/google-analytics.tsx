'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: unknown[];
  }
}

const isStoredConsent = (value: string | null): value is 'granted' | 'denied' =>
    value === 'granted' || value === 'denied';

export function GoogleAnalytics() {
    const gtmId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname || !gtmId || typeof window.gtag !== 'function') {
            return;
        }

        const storedConsent = localStorage.getItem('cookie_consent');
        if (isStoredConsent(storedConsent)) {
            window.gtag('consent', 'update', {
                ad_storage: storedConsent,
                analytics_storage: storedConsent,
            });
        }

        const pagePath = pathname + window.location.search;
        window.gtag('event', 'page_view', {
            page_path: pagePath,
            page_location: window.location.href,
            page_title: document.title,
            send_to: gtmId,
        });
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
                        gtag('config', '${gtmId}', {
                            'send_page_view': false
                        });
                    `,
                }}
            />
        </>
    );
}
