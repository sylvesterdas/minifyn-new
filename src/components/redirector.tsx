'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap } from 'lucide-react';

export function Redirector({ longUrl }: { longUrl: string }) {
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsRedirecting(true);
            // Small delay for fade-out animation to complete
            setTimeout(() => {
                window.location.href = longUrl;
            }, 500);
        }, 1500); // 1.5 second delay before starting redirect

        return () => clearTimeout(timer);
    }, [longUrl]);

    return (
        <main className={`flex flex-col items-center justify-center min-h-screen transition-opacity duration-500 ${isRedirecting ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center space-y-4 p-4">
                <div className="flex justify-center items-center gap-2">
                    <Zap className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">MiniFyn</h1>
                </div>
                <p className="text-muted-foreground">Please wait while we redirect you safely to your destination.</p>
                
                <div className="w-full max-w-sm mx-auto space-y-3 pt-8 animate-pulse">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        </main>
    );
}
