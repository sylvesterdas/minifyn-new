
'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle?: any[];
    }
}

interface AdsenseAdProps {
    adSlot: string;
    adClient: string;
}

export function AdsenseAd({ adSlot, adClient }: AdsenseAdProps) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    if (!adSlot || !adClient) {
        return null;
    }

    return (
        <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
        ></ins>
    );
}
