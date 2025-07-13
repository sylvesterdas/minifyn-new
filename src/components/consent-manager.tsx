'use client';

import Script from 'next/script';

export function ConsentManager() {
    const publisherId = process.env.NEXT_PUBLIC_GOOGLE_PUBLISHER_ID;

    if (!publisherId) {
        console.warn("Google Publisher ID is not set. Consent Manager will not be loaded.");
        return null;
    }

    return (
        <Script
            id="google-funding-choices"
            src={`https://fundingchoicesmessages.google.com/i/${publisherId}?ers=1`}
            strategy="beforeInteractive"
            async
        />
    );
}
