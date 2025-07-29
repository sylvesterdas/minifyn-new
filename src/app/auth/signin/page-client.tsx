
'use client';

import { useEffect, useState } from 'react';
import { login, resendVerificationLink } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth as firebaseClientAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export interface FormState {
    error?: string;
    success?: boolean;
    message?: string;
    emailNotVerified?: boolean;
    email?: string;
}

export function SignInPageComponent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResend, setShowResend] = useState(false);
    
    const [resendState, setResendState] = useState<{ error?: string; success?: boolean; message?: string; }>({ success: false });

    const { toast } = useToast();
    
    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error,
                variant: 'destructive',
            });
            setError(null); // Reset error after showing toast
        }
    }, [error, toast]);
    
    useEffect(() => {
        if (resendState.message) {
            toast({
                title: resendState.success ? 'Email Sent' : 'Error',
                description: resendState.message,
                variant: resendState.success ? 'default' : 'destructive',
            });
        }
        if (resendState.error) {
            toast({
                title: 'Error',
                description: resendState.error,
                variant: 'destructive'
            });
        }
    }, [resendState, toast]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setShowResend(false);

        try {
            const userCredential = await signInWithEmailAndPassword(firebaseClientAuth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setError("Your email address is not verified.");
                setShowResend(true);
                setIsLoading(false);
                return;
            }
            
            // Force refresh the token to ensure it's not expired
            const idToken = await user.getIdToken(true);
            const result = await login(idToken);

            if (result.success) {
                toast({
                    title: 'Success',
                    description: 'Logged in successfully! Redirecting...',
                });
                // Use window.location.assign for a hard refresh to ensure all server components
                // and context providers are re-evaluated with the new session cookie.
                window.location.assign('/dashboard');
            } else {
                setError(result.error || 'An unknown server error occurred.');
                setIsLoading(false);
            }

        } catch (authError: any) {
            if (authError.code === 'auth/invalid-credential' || authError.code === 'auth/wrong-password' || authError.code === 'auth/user-not-found') {
                setError('Invalid email or password.');
            } else if (authError.code === 'auth/too-many-requests') {
                 setError('Too many failed login attempts. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again.');
                console.error('Firebase Auth Error:', authError);
            }
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/auth/forgot-password" passHref className="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {showResend && (
                         <p className="text-sm text-center text-muted-foreground">
                            Your email is not verified.
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const result = await resendVerificationLink(resendState, formData);
                                setResendState(result);
                            }}>
                                <input type="hidden" name="email" value={email} />
                                <Button variant="link" type="submit" className="p-0 h-auto">Resend verification email</Button>
                            </form>
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                   <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </Button>
                    <div className="text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
