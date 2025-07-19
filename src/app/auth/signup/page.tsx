
'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState, Suspense, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { sendVerificationOtp, verifyOtpAndCreateUser } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, MailCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/gtag';
import { OtpDialog } from '@/components/otp-dialog';

export interface FormState {
    error?: string;
    success?: boolean;
    message?: string;
    otpError?: boolean;
}

function SignUpPageComponent() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isOtpSending, startOtpTransition] = useTransition();
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [view, setView] = useState<'form' | 'success'>('form');

    const handleInitialSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password || !termsAccepted) {
            toast({ title: 'Missing Fields', description: 'Please fill out all fields and accept the terms.', variant: 'destructive' });
            return;
        }

        startOtpTransition(async () => {
            const result = await sendVerificationOtp(email);
            if (result.success) {
                toast({ title: 'OTP Sent', description: 'A verification code has been sent to your email.' });
                setShowOtpDialog(true);
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        });
    };

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
        <>
            <OtpDialog
                isOpen={showOtpDialog}
                onClose={() => setShowOtpDialog(false)}
                email={email}
                password={password}
                termsAccepted={termsAccepted}
                onSuccess={() => {
                    setShowOtpDialog(false);
                    setView('success');
                }}
            />
            <Card className="mx-auto max-w-md mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl">Create a free account</CardTitle>
                    <CardDescription>
                        Get started with a free account to manage your links. You can upgrade to Pro anytime.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleInitialSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
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
                        <Button type="submit" className="w-full" disabled={isOtpSending || !termsAccepted}>
                            {isOtpSending ? <Loader2 className="animate-spin" /> : 'Create an account'}
                        </Button>
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

export default function SignUpPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpPageComponent />
        </Suspense>
    );
}
