
'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState, useTransition, Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import { sendVerificationOtp, verifyOtp, signup } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, MailCheck, Check, BadgeAlert } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/gtag';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';

export interface FormState {
    error?: string;
    success?: boolean;
    message?: string;
}

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending || disabled}>
            {pending ? <Loader2 className="animate-spin" /> : 'Create an account'}
        </Button>
    );
}

function SignUpPageComponent() {
    const { toast } = useToast();
    const [view, setView] = useState<'form' | 'success'>('form');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const [isOtpSending, startOtpTransition] = useTransition();
    const [otp, setOtp] = useState('');
    const [isOtpVerifying, startOtpVerifyTransition] = useTransition();

    const [otpSent, setOtpSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpError, setOtpError] = useState(false);

    const [signupState, signupAction] = useActionState(signup, { success: false });

    useEffect(() => {
        if (signupState.success && signupState.message) {
            setView('success');
            toast({ title: 'Success!', description: signupState.message });
            trackEvent({ action: 'sign_up', category: 'conversion', label: 'email_password_signup_free' });
        }
        if (signupState.error) {
            toast({ title: 'Error', description: signupState.error, variant: 'destructive' });
        }
    }, [signupState, toast]);

    const handleSendOtp = () => {
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            toast({ title: 'Invalid Email', description: 'Please enter a valid email address.', variant: 'destructive'});
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

    if (view === 'success') {
         return (
             <Card className="mx-auto max-w-sm text-center mb-8">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <MailCheck className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl pt-4">Account Created!</CardTitle>
                    <CardDescription>
                       Your account has been successfully created. You can now sign in.
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
        <Card className="mx-auto max-w-md mb-8">
            <CardHeader>
                <CardTitle className="text-2xl">Create a free account</CardTitle>
                <CardDescription>
                    Get started with a free account to manage your links. You can upgrade to Pro anytime.
                </CardDescription>
            </CardHeader>
            <form action={signupAction}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="flex gap-2">
                             <Input id="email" name="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={otpSent} />
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
                    <SubmitButton disabled={!emailVerified || !password || !termsAccepted} />
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

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpPageComponent />
        </Suspense>
    );
}
