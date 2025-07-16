'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Cookie } from 'lucide-react';

export function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        // Only show the banner if no consent has been given yet
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleConsent = (consent: 'granted' | 'denied') => {
        localStorage.setItem('cookie_consent', consent);
        setShowBanner(false);

        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': consent,
                'ad_storage': consent,
            });
        }
    };

    if (!showBanner) {
        return null;
    }

    return (
        <Card className="fixed bottom-4 left-4 right-4 z-[101] animate-in slide-in-from-bottom-10 duration-500 shadow-2xl md:left-auto md:w-full md:max-w-md">
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex-shrink-0">
                        <Cookie className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-semibold">We use cookies</h3>
                        <p className="text-sm text-muted-foreground">
                            We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our{' '}
                            <Link href="/cookie-policy" className="underline">
                                Cookie Policy
                            </Link>.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleConsent('denied')}>
                            Decline
                        </Button>
                        <Button size="sm" onClick={() => handleConsent('granted')}>
                            Accept
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
