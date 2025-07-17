
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PricingPageClient } from '@/components/pricing-client';
import { updateUserProfile } from '../settings/actions';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/gtag';

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleContinueFree = async () => {
        if (!user) return;
        
        // We still need to mark onboarding as complete
        const formData = new FormData();
        formData.append('name', user.name || '');
        formData.append('isOnboarding', 'true');

        trackEvent({
            action: 'onboarding_choice',
            category: 'conversion',
            label: 'chose_free_plan'
        });

        const result = await updateUserProfile(null, formData);
        
        if (result.success) {
            window.location.assign('/dashboard');
        } else {
            toast({
                title: 'Error',
                description: result.error || 'Could not complete onboarding.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="w-full max-w-5xl">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Welcome to MiniFyn, {user?.name?.split(' ')[0]}!</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Choose a plan to get started. You can always upgrade or change your mind later.
                </p>
            </header>
            
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* Free Plan */}
                <Card className="flex flex-col text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free Plan</CardTitle>
                        <CardDescription>Perfect for personal use and getting started.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                         <p className="text-4xl font-bold">₹0</p>
                         <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center justify-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> 20 Links / Day</li>
                            <li className="flex items-center justify-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Basic Analytics</li>
                            <li className="flex items-center justify-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Links Expire in 60 Days</li>
                         </ul>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full" variant="outline" onClick={handleContinueFree}>
                           Continue with Free <ArrowRight className="ml-2" />
                        </Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan Section */}
                <Card className="flex flex-col border-primary shadow-lg shadow-primary/10 relative">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                           <Star className="h-4 w-4"/> Recommended
                        </div>
                     </div>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Upgrade to Pro</CardTitle>
                        <CardDescription>For power users and businesses who need more.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* We reuse the pricing client component here for consistency */}
                        <PricingPageClient context="onboarding" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
