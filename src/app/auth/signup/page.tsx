
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
import { Loader2, ExternalLink, MailCheck, ShieldCheck, HelpCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/gtag';
import { PlanSelector, type Plan } from '@/components/plan-selector';
import { OtpDialog } from '@/components/otp-dialog';
import { createRazorpaySubscription, syncRazorpaySubscription } from '@/app/payments/actions';
import Script from 'next/script';
import { signInWithCustomToken } from 'firebase/auth';
import { auth as firebaseClientAuth } from '@/lib/firebase';
import { login } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';


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
    const router = useRouter();
    const [freePlanState, freePlanFormAction] = useActionState(signup, { success: false });
    
    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<Plan>('free');
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    // UI state
    const [view, setView] = useState<'form' | 'email_verification' | 'payment_processing' | 'payment_stalled'>('form');
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
            setView('email_verification');
        }
    }, [freePlanState, toast]);

    // Main form submission logic
    const handleSubmit = (formData: FormData) => {
        if (selectedPlan === 'free') {
            freePlanFormAction(formData);
        } else {
            setShowOtpDialog(true);
        }
    };
    
    const triggerPayment = async (customToken: string) => {
        if (isPaymentLoading) return;
        setIsPaymentLoading(true);
        setShowOtpDialog(false);
        setView('payment_processing');

        try {
            const userCredential = await signInWithCustomToken(firebaseClientAuth, customToken);
            const idToken = await userCredential.user.getIdToken();

            const subscriptionResult = await createRazorpaySubscription('monthly', idToken);
            if ('error' in subscriptionResult) throw new Error(subscriptionResult.error);
            
            const rzp = new window.Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionResult.subscriptionId,
                name: "MiniFyn Pro",
                description: "Monthly Subscription",
                handler: async (response: any) => {
                    toast({ title: 'Payment Successful!', description: 'Finalizing your account...' });

                    // Use the new server action to finalize the upgrade.
                    const syncResult = await syncRazorpaySubscription();

                    if (syncResult.success) {
                        trackEvent({ action: 'purchase', category: 'conversion', label: 'pro_plan_signup', value: 89 });
                        toast({ title: "Upgrade Complete!", description: "Redirecting to your dashboard." });
                        // We use window.location.assign to ensure a full page refresh
                        // which loads the new session cookie and auth claims.
                        window.location.assign('/dashboard');
                    } else {
                        // This case handles if the sync fails for some reason
                         toast({ title: "Activation Pending", description: syncResult.error, variant: 'destructive' });
                         setView('payment_stalled');
                    }
                },
                modal: { 
                    ondismiss: () => {
                        setIsPaymentLoading(false);
                        // If user closes modal, reset the view
                        setView('form');
                    }
                },
                prefill: { name, email },
                theme: { color: "#1e40af" }
            });

            rzp.on('payment.failed', (response: any) => {
                toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
                setIsPaymentLoading(false);
                setView('form');
            });

            rzp.open();

        } catch(error) {
             const message = error instanceof Error ? error.message : 'Could not initiate payment.';
             toast({ title: 'Error', description: message, variant: 'destructive' });
             setIsPaymentLoading(false);
             setView('form');
        }
    };

    if (view === 'email_verification') {
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

     if (view === 'payment_processing') {
        return (
             <Card className="mx-auto max-w-sm text-center">
                <CardHeader>
                    <div className="mx-auto p-3 rounded-full w-fit">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    </div>
                    <CardTitle className="text-2xl pt-4">Processing Subscription</CardTitle>
                    <CardDescription>
                       Your payment was successful. We're upgrading your account to Pro now. Please wait...
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }
    
    if (view === 'payment_stalled') {
        return (
             <Card className="mx-auto max-w-sm text-center">
                <CardHeader>
                     <div className="mx-auto bg-yellow-500/10 p-3 rounded-full w-fit">
                        <HelpCircle className="h-12 w-12 text-yellow-400" />
                    </div>
                    <CardTitle className="text-2xl pt-4">Activation is Taking Longer Than Usual</CardTitle>
                    <CardDescription>
                       Your payment was successful, but we're still waiting for final confirmation from the payment provider. You can now safely close this window. Please try logging in again in a few minutes. If you still don't have access, use the "Restore Purchase" button on the billing page.
                    </CardDescription>
                </CardHeader>
                 <CardFooter className="flex flex-col gap-2">
                     <Button asChild className="w-full">
                        <Link href="/auth/signin">Go to Sign In</Link>
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
                name={name}
                password={password}
                onVerified={triggerPayment}
                isPaymentLoading={isPaymentLoading}
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

    
