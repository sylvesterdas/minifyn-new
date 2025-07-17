// This page is no longer part of the main user flow.
// The new signup process integrates plan selection directly.
// This file can be safely deleted, but is kept to avoid breaking changes if linked elsewhere.
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DeprecatedOnboardingPage() {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Page moved</h1>
            <p className="text-muted-foreground">This onboarding flow has been moved.</p>
            <Button asChild className="mt-4">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    );
}
