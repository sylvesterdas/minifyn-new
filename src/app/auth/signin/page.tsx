'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { login, resendVerificationLink } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface FormState {
    error?: string;
    success?: boolean;
    message?: string;
    emailNotVerified?: boolean;
    email?: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : 'Sign In'}
        </Button>
    );
}

export default function SignInPage() {
    const [state, formAction] = useActionState(login, { success: false });
    const { toast } = useToast();
    const router = useRouter();
    
    useEffect(() => {
        if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
        console.log(state)
        if (state.success && !state.emailNotVerified) {
            toast({
                title: 'Success',
                description: 'Logged in successfully!',
            });
            router.refresh();
            router.push('/dashboard');
        }
    }, [state, toast, router]);

    const handleResend = async () => {
        if (state.email) {
            const formData = new FormData();
            formData.append('email', state.email);
            const result = await resendVerificationLink({}, formData);
            if (result.success) {
                toast({
                    title: 'Email Sent',
                    description: result.message,
                });
            } else if (result.error) {
                 toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive'
                });
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign In</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/auth/forgot-password" passHref className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {state.emailNotVerified && (
                             <p className="text-sm text-center text-muted-foreground">
                                Your email is not verified. <Button variant="link" type="button" onClick={handleResend} className="p-0 h-auto">Resend verification email</Button>
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <SubmitButton />
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/signup" className="underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
