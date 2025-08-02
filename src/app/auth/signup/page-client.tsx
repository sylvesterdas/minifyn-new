
'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { sendVerificationOtp, verifyOtp, signup, login } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/gtag';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { signInWithCustomToken } from 'firebase/auth';
import { auth as firebaseClientAuth } from '@/lib/firebase';

export interface FormState {
    error?: string;
    success?: boolean;
    plan?: string;
    interval?: string;
    user?: {
        uid: string;
        email: string;
        customToken: string;
    };
}

function SubmitButton({ disabled, pending }: { disabled: boolean; pending: boolean; }) {
    return (
        <Button type="submit" className="w-full" disabled={pending || disabled}>
            {pending ? <Loader2 className="animate-spin" /> : 'Create a free account'}
        </Button>
    );
}

export function SignUpPageComponent() {
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const [isOtpSending, startOtpTransition] = useTransition();
    const [otp, setOtp] = useState('');
    const [isOtpVerifying, startOtpVerifyTransition] = useTransition();

    const [otpSent, setOtpSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpError, setOtpError] = useState(false);
    
    const [signupState, setSignupState] = useState<FormState>({ success: false });
    const [isSigningUp, setIsSigningUp] = useState(false);

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
            handleFreeSignup(signupState.user.customToken);
        }
    }, [signupState, toast]);


    const handleSendOtp = () => {
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
        <Card className="mx-auto max-w-md mb-8">
            <CardHeader>
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>
                    Get started with a free account to manage your links and view analytics.
                </CardDescription>
            </CardHeader>
            <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSigningUp(true);
                const formData = new FormData(e.currentTarget);
                const result = await signup(signupState, formData);
                setSignupState(result as any);
                setIsSigningUp(false);
            }}>
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="plan" value="free" />
                <CardContent className="grid gap-4">
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
                    <SubmitButton disabled={!emailVerified || !validatePassword(password) || !termsAccepted} pending={isSigningUp} />
                    <div className="text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
