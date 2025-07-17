
'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signup } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, MailCheck, ShieldCheck, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/gtag';
import { PlanSelector, type Plan } from '@/components/plan-selector';
import { OtpDialog } from '@/components/otp-dialog';
import { createRazorpaySubscription } from '@/app/payments/actions';
import Script from 'next/script';

export interface FormState {
    error?: string;
    success?: boolean;
    message?: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

function SubmitButton({ plan, disabled }: { plan: Plan, disabled: boolean }) {
    const { pending } = useFormStatus();
    const isPro = plan === 'pro';
    const buttonText = isPro ? "Continue to Purchase" : "Create an account";
    return (
        <Button type="submit" className="w-full" disabled={pending || disabled}>
            {pending ? <Loader2 className="animate-spin" /> : buttonText}
        </Button>
    );
}

export default function SignUpPage() {
    const { toast } = useToast();
    const [freePlanState, freePlanFormAction] = useActionState(signup, { success: false });
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<Plan>('free');
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    // UI state
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    // Effect for handling Free Plan submission result
    useEffect(() => {
        if (freePlanState.error) {
            toast({ title: 'Error', description: freePlanState.error, variant: 'destructive' });
        }
        if (freePlanState.success) {
            toast({ title: 'Account Created!', description: freePlanState.message });
            trackEvent({ action: 'sign_up', category: 'conversion', label: 'email_password_signup_free' });
            setShowVerificationMessage(true);
        }
    }, [freePlanState, toast]);

    // Main form submission logic
    const handleSubmit = (formData: FormData) => {
        if (selectedPlan === 'free') {
            freePlanFormAction(formData);
        } else {
            // For Pro plan, we open the OTP dialog instead of submitting the form directly
            setShowOtpDialog(true);
        }
    };
    
    // Logic for handling successful payment
    const handleSuccessfulPayment = () => {
        toast({ title: 'Payment Successful!', description: 'Your plan has been upgraded to Pro.' });
        trackEvent({ action: 'purchase', category: 'conversion', label: 'pro_plan_signup', value: 89 });
        window.location.assign('/dashboard');
    }
    
    // Logic for triggering Razorpay checkout
    const triggerPayment = async (userId: string, userName: string, userEmail: string) => {
        setIsPaymentLoading(true);
        try {
            const subscriptionResult = await createRazorpaySubscription('monthly'); // Default to monthly for now
             if ('error' in subscriptionResult) throw new Error(subscriptionResult.error);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionResult.subscriptionId,
                name: "MiniFyn Pro",
                description: "Monthly Subscription",
                handler: handleSuccessfulPayment,
                prefill: { name: userName, email: userEmail },
                theme: { color: "#1e40af" }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
            });
            rzp.open();

        } catch(error) {
             toast({ title: 'Error', description: error instanceof Error ? error.message : 'Could not initiate payment.', variant: 'destructive' });
        } finally {
            setIsPaymentLoading(false);
            setShowOtpDialog(false);
        }
    };

    if (showVerificationMessage) {
        return (
             <Card className="mx-auto max-w-sm text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <MailCheck className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl pt-4">Check Your Inbox</CardTitle>
                    <CardDescription>
                       We've sent a verification link to your email address. Please click the link to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                     <Button asChild className="w-full">
                        <Link href="/auth/signin">Proceed to Sign In</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <>
            <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            <OtpDialog 
                open={showOtpDialog}
                onOpenChange={setShowOtpDialog}
                email={email}
                password={password}
                name={name}
                onVerified={triggerPayment}
            />
            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create your account</CardTitle>
                    <CardDescription>
                        Get started in seconds. Choose your plan below.
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <PlanSelector selectedPlan={selectedPlan} onPlanChange={setSelectedPlan} />

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="terms-accepted" 
                                name="terms-accepted"
                                checked={termsAccepted}
                                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms-accepted"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I accept the <Link href="/terms" target="_blank" rel="noopener noreferrer" className="inline-flex items-center underline hover:text-primary">Terms of Service <ExternalLink className="ml-1 h-3 w-3" /></Link>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <SubmitButton plan={selectedPlan} disabled={!termsAccepted || isPaymentLoading} />
                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </>
    );
}

