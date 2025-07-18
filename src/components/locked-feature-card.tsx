
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lock, ArrowRight } from 'lucide-react';

interface LockedFeatureCardProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export function LockedFeatureCard({ title, description, children }: LockedFeatureCardProps) {
    return (
        <Card className="relative overflow-hidden">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Render the blurred placeholder content */}
                <div className="blur-sm pointer-events-none">
                    {children}
                </div>
            </CardContent>
            {/* Overlay with upgrade message */}
            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center p-6">
                <Lock className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold">Upgrade to Pro to unlock</h3>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <Button asChild>
                    <Link href="/dashboard/settings/billing">Upgrade Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        </Card>
    );
}
