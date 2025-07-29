
'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { sendVerificationOtp, verifyOtp, signup, finalizeProSignup, login } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, MailCheck, Check, BadgeAlert, Star, CreditCard, ArrowRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/gtag';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Script from 'next/script';
import { signInWithCustomToken } from 'firebase/auth';
import { auth as firebaseClientAuth } from '@/lib/firebase';
import { createRazorpaySubscription } from '@/app/payments/actions';
import { Badge } from '@/components/ui/badge';

type Plan = 'free' | 'pro-monthly' | 'pro-yearly';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export interface FormState {
    error?: string;
    success?: boolean;
    message?: string;
    plan?: 'free' | 'pro';
    interval?: 'monthly' | 'yearly';
    user?: {
        uid: string;
        email: string;
        customToken: string;
    };
}

function SubmitButton({ disabled, isProPlan, pending }: { disabled: boolean; isProPlan: boolean; pending: boolean; }) {
    const buttonText = isProPlan ? 'Proceed to Payment' : 'Create a free account';
    
    return (
        <Button type="submit" className="w-full" disabled={pending || disabled}>
            {pending ? <Loader2 className="animate-spin" /> : (
                <>
                    {buttonText}
                    {isProPlan && <ArrowRight className="ml-2" />}
                </>
            )}
        </Button>
    );
}

export function SignUpPageComponent() {
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const [isOtpSending, startOtpTransition] = useTransition();
    const [otp, setOtp] = useState('');
    const [isOtpVerifying, startOtpVerifyTransition] = useTransition();

    const [otpSent, setOtpSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);
    
    const initialPlan = searchParams.get('plan') === 'pro'
        ? (searchParams.get('interval') === 'yearly' ? 'pro-yearly' : 'pro-monthly')
        : 'free';
    const [selectedPlan, setSelectedPlan] = useState<Plan>(initialPlan);

    const [signupState, setSignupState] = useState<FormState>({ success: false });
    const [isSigningUp, setIsSigningUp] = useState(false);

    const isProPlan = selectedPlan.startsWith('pro-');

    const dynamicTexts = useMemo(() => {
        if (isProPlan) {
            return {
                title: 'Go Pro',
                description: 'You\'re one step away from unlocking all premium features. Complete your payment to get started.'
            };
        }
        return {
            title: 'Create your account',
            description: 'Get started with a free account to manage your links and view analytics.'
        };
    }, [isProPlan]);

    const handleFreeSignup = async (customToken: string) => {
        try {
            const userCredential = await signInWithCustomToken(firebaseClientAuth, customToken);
            const idToken = await userCredential.user.getIdToken(true);
            const result = await login(idToken);
            if (result.success) {
                toast({ title: 'Welcome!', description: 'Your account has been created.' });
                trackEvent({ action: 'sign_up', category: 'conversion', label: 'email_password_signup_free' });
                window.location.assign('/dashboard');
            } else {
                throw new Error(result.error || 'Failed to create session.');
            }
        } catch (error) {
             toast({
                title: 'Login Failed',
                description: error instanceof Error ? error.message : 'An unknown error occurred.',
                variant: 'destructive'
            });
        }
    };
    
    useEffect(() => {
        if (signupState.error) {
            toast({ title: 'Error', description: signupState.error, variant: 'destructive' });
        } else if (signupState.success && signupState.user) {
            if (signupState.plan === 'pro' && signupState.interval) {
                // Pro plan: Initiate payment
                handlePayment(signupState.user.customToken, signupState.interval, signupState.user);
            } else if (signupState.plan === 'free') {
                // Free plan: Auto-login
                handleFreeSignup(signupState.user.customToken);
            }
        }
    }, [signupState, toast]);

    const handlePayment = async (customToken: string, interval: 'monthly' | 'yearly', user: FormState['user']) => {
        if (!user) return;
        
        try {
             // 1. Sign in with the custom token to get an ID token
            const userCredential = await signInWithCustomToken(firebaseClientAuth, customToken);
            const idToken = await userCredential.user.getIdToken(true);

            // 2. Create Razorpay subscription
            const subscriptionResult = await createRazorpaySubscription(interval, idToken);
            if ('error' in subscriptionResult) {
                throw new Error(subscriptionResult.error);
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                subscription_id: subscriptionResult.subscriptionId,
                name: "MiniFyn Pro",
                description: interval === 'monthly' ? 'Monthly Subscription' : 'Yearly Subscription',
                handler: async function (response: any) {
                    setIsFinalizing(true);
                    toast({ title: 'Payment Successful!', description: 'Finalizing your account...' });
                    const finalizeResult = await finalizeProSignup(await userCredential.user.getIdToken(true));

                    if (finalizeResult.success) {
                        toast({ title: "Upgrade Complete!", description: "Your account is now Pro." });
                        trackEvent({ action: 'purchase', category: 'conversion', label: `pro_plan_signup_${interval}` });
                        window.location.assign('/dashboard');
                    } else {
                         toast({ title: "Activation Error", description: finalizeResult.error, variant: 'destructive' });
                         setIsFinalizing(false);
                    }
                },
                modal: { ondismiss: () => handleFreeSignup(customToken) },
                prefill: { email: user.email },
                theme: { color: "#1e40af" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
                handleFreeSignup(customToken);
            });
            rzp.open();

        } catch (error) {
             toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Could not initiate payment.',
                variant: 'destructive',
            });
            // If payment initiation fails, still log them in with a free account as a fallback
            handleFreeSignup(customToken);
        }
    }


    const handleSendOtp = () => {
        // This regex is environment-dependent.
        const isProduction = process.env.NODE_ENV === 'production';
        const emailRegex = isProduction 
            ? /^[a-zA-Z0-9._%'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
        if (!emailRegex.test(email)) {
            const errorMessage = isProduction 
                ? 'Please enter a valid email address without sub-addressing (+ symbols).'
                : 'Please enter a valid email address.';
            toast({ title: 'Invalid Email', description: errorMessage, variant: 'destructive'});
            return;
        }

        startOtpTransition(async () => {
            const result = await sendVerificationOtp(email);
            if (result.success) {
                toast({ title: 'OTP Sent', description: 'A verification code has been sent to your email.' });
                setOtpSent(true);
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        });
    };
    
    const handleVerifyOtp = () => {
        setOtpError(false);
        startOtpVerifyTransition(async () => {
            const result = await verifyOtp(email, otp);
            if (result.success) {
                toast({ title: 'Email Verified!', description: 'Your email has been successfully verified.' });
                setEmailVerified(true);
            } else {
                setOtpError(true);
                toast({ title: 'Invalid OTP', description: result.error, variant: 'destructive' });
            }
        });
    }

    const validatePassword = (pass: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(pass);
    }

    return (
        <>
        {isFinalizing && (
            <div className="fixed inset-0 bg-background/80 flex flex-col items-center justify-center z-[100] animate-in fade-in duration-300">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h2 className="text-xl font-semibold">Finalizing Setup...</h2>
                <p className="text-muted-foreground">Please wait while we activate your Pro account.</p>
            </div>
        )}
        <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
        <Card className="mx-auto max-w-md mb-8">
            <CardHeader>
                <CardTitle className="text-2xl">{dynamicTexts.title}</CardTitle>
                <CardDescription>
                    {dynamicTexts.description}
                </CardDescription>
            </CardHeader>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSigningUp(true);
                const formData = new FormData(e.currentTarget);
                const result = await signup(signupState, formData);
                setSignupState(result);
                setIsSigningUp(false);
            }}>
                <input type="hidden" name="email" value={email} />
                <CardContent className="grid gap-4">
                     <div className="grid gap-4">
                        <Label>Choose your plan</Label>
                        <RadioGroup
                            name="plan"
                            value={selectedPlan}
                            onValueChange={(value: Plan) => setSelectedPlan(value)}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="pro-monthly" id="pro-monthly" className="peer sr-only" />
                                    <Label htmlFor="pro-monthly" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                        <p className="font-bold text-base">Pro Monthly</p>
                                        <p className="font-normal mt-2 text-lg">₹89/mo</p>
                                    </Label>
                                </div>
                                <div className="relative">
                                    <RadioGroupItem value="pro-yearly" id="pro-yearly" className="peer sr-only" />
                                    <Label htmlFor="pro-yearly" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-full">
                                        <div className="text-center">
                                            <p className="font-bold text-base">Pro Yearly</p>
                                            <p className="font-normal mt-2 text-lg">₹899/yr</p>
                                        </div>
                                    </Label>
                                     <Badge variant="secondary" className="absolute top-0 left-2 -translate-y-1/2 text-xs h-auto py-0.5 px-1.5 text-green-600 bg-background border-green-500/50">
                                        Save 15%
                                    </Badge>
                                    <Badge variant="secondary" className="absolute top-0 right-2 -translate-y-1/2 text-xs h-auto py-0.5 px-1.5 text-primary bg-background border-primary/50">
                                        Best Value
                                    </Badge>
                                </div>
                            </div>
                             <div>
                                <RadioGroupItem value="free" id="free" className="peer sr-only" />
                                <Label htmlFor="free" className="flex items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent/50 hover:text-accent-foreground peer-data-[state=checked]:border-muted-foreground/50 [&:has([data-state=checked])]:border-muted-foreground/50 cursor-pointer">
                                    <p className="font-semibold text-muted-foreground">Or continue with a Free account</p>
                                    <p className="font-normal text-muted-foreground">₹0</p>
                                </Label>
                            </div>
                        </RadioGroup>
                        {selectedPlan === 'free' && (
                            <div className="text-center p-2 text-xs text-muted-foreground animate-in fade-in duration-500">
                                <p>
                                    Missing out on Pro features?{' '}
                                    <Link href="/pricing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center underline text-primary hover:text-primary/80">
                                        Compare plans <ExternalLink className="ml-1 h-3 w-3" />
                                    </Link>
                                    {' '}and unlock permanent links and advanced analytics.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex gap-2">
                             <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={otpSent} />
                             {emailVerified ? (
                                <Button type="button" variant="outline" className="w-32 text-green-500" disabled>
                                    <Check className="mr-2 h-4 w-4" /> Verified
                                </Button>
                             ) : (
                                <Button type="button" onClick={handleSendOtp} disabled={isOtpSending || !email} className="w-32">
                                    {isOtpSending ? <Loader2 className="animate-spin" /> : 'Verify'}
                                </Button>
                             )}
                        </div>
                    </div>
                    
                    {otpSent && !emailVerified && (
                        <div className="space-y-2 animate-in fade-in duration-500">
                             <Label htmlFor="otp">Verification Code</Label>
                             <div className="flex gap-2">
                                <InputOTP maxLength={4} value={otp} onChange={setOtp} name="otp" >
                                    <InputOTPGroup className={cn(otpError && "animate-shake border-destructive")}>
                                        <InputOTPSlot index={0} className={cn(otpError && 'border-destructive text-destructive')} />
                                        <InputOTPSlot index={1} className={cn(otpError && 'border-destructive text-destructive')} />
                                        <InputOTPSlot index={2} className={cn(otpError && 'border-destructive text-destructive')} />
                                        <InputOTPSlot index={3} className={cn(otpError && 'border-destructive text-destructive')} />
                                    </InputOTPGroup>
                                </InputOTP>
                                <Button type="button" variant="secondary" onClick={handleVerifyOtp} disabled={isOtpVerifying || otp.length < 4}>
                                    {isOtpVerifying ? <Loader2 className="animate-spin" /> : 'Check'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        {password.length > 0 && !validatePassword(password) && (
                            <p className="text-xs text-muted-foreground animate-in fade-in duration-300">
                                Must be 8+ characters with an uppercase letter, a number, and a symbol (e.g., @, $, !).
                            </p>
                        )}
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
                    <SubmitButton disabled={!emailVerified || !validatePassword(password) || !termsAccepted} isProPlan={isProPlan} pending={isSigningUp} />
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
