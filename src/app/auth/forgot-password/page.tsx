'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { sendPasswordResetLink } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface FormState {
    error?: string;
    success?: boolean;
    message?: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
        </Button>
    );
}

export default function ForgotPasswordPage() {
    const [state, formAction] = useActionState(sendPasswordResetLink, { success: false });
    const { toast } = useToast();

    useEffect(() => {
        if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
        if (state.success && state.message) {
            toast({
                title: 'Request Sent',
                description: state.message,
            });
        }
    }, [state, toast]);

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email and we'll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <SubmitButton />
                </CardContent>
            </form>
            <div className="mt-4 text-center text-sm pb-6">
                Remember your password?{' '}
                <Link href="/auth/signin" className="underline">
                    Sign in
                </Link>
            </div>
        </Card>
    );
}
