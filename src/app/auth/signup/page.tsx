
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
import { Loader2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { trackEvent } from '@/lib/gtag';

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

export default function SignUpPage() {
    const [state, formAction] = useActionState(signup, { success: false });
    const { toast } = useToast();
    const router = useRouter();
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
        if (state.success) {
            toast({
                title: 'Account Created!',
                description: state.message || "Please check your email to verify your account.",
            });
            trackEvent({
                action: 'sign_up',
                category: 'conversion',
                label: 'email_password_signup',
            });
            // After successful signup and toast, redirect to signin page
            router.push('/auth/signin');
        }
    }, [state, toast, router]);

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
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
                    <SubmitButton disabled={!termsAccepted} />
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
