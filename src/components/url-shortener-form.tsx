
'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { shortenUrl, type FormState } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clipboard, Check, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import Link from 'next/link';
import { ToastAction } from './ui/toast';

function SubmitButton({ pending, disabled }: { pending: boolean, disabled: boolean }) {
    return (
        <Button type="submit" className="w-full font-semibold" disabled={pending || disabled}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                </>
            ) : (
                <>
                    Shorten URL
                    <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    );
}

export function UrlShortenerForm() {
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                setIsAuthLoading(false);
            } else {
                signInAnonymously(auth)
                    .then((anonUser) => {
                        setCurrentUser(anonUser.user);
                    })
                    .catch((error) => {
                        console.error("Anonymous sign-in failed:", error);
                    })
                    .finally(() => {
                         setIsAuthLoading(false);
                    });
            }
        });
        return () => unsubscribe();
    }, []);

    const initialState: FormState = { success: false, message: '' };
    const [state, formAction, isPending] = useActionState(shortenUrl, initialState);

    useEffect(() => {
        if (!state.success && state.message) {
            if (state.errorCode === 'ANON_LIMIT_REACHED') {
                 toast({
                    title: "Daily Limit Reached",
                    description: "Sign up for a free account to create up to 20 links per day!",
                    variant: "destructive",
                    action: (
                       <ToastAction altText="Sign Up" asChild>
                         <Link href="/auth/signup">Sign Up</Link>
                       </ToastAction>
                    ),
                });
            } else {
                 toast({
                    title: "Oops!",
                    description: state.message,
                    variant: "destructive",
                });
            }
        } else if (state.success && state.shortUrl) {
            setShortenedUrl(state.shortUrl);
            formRef.current?.reset();
        }
    }, [state, toast]);
    
    const handleCopy = () => {
        if (shortenedUrl) {
            navigator.clipboard.writeText(shortenedUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/20 shadow-2xl shadow-black/20 rounded-t-none">
             <CardHeader>
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <Image src="/logo.png" alt="MiniFyn Logo" width={32} height={32} />
                    mnfy.in
                </CardTitle>
                <CardDescription className="text-center pt-2">
                    The simplest way to shorten and share your links.
                </CardDescription>
            </CardHeader>
            <form ref={formRef} action={formAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="longUrl">URL to shorten</Label>
                        <Input
                            id="longUrl"
                            name="longUrl"
                            placeholder="https://your-super-long-url.com/goes-here"
                            required
                            type="url"
                        />
                        <input type="hidden" name="userId" value={currentUser?.uid ?? ''} />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <SubmitButton pending={isPending} disabled={isAuthLoading} />
                     {shortenedUrl && (
                        <div className="w-full p-3 rounded-md bg-accent/20 border border-accent flex items-center justify-between animate-in fade-in duration-500">
                            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-accent-foreground truncate hover:underline">
                                {shortenedUrl.replace(/^https?:\/\//, '')}
                            </a>
                            <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy to clipboard">
                                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
}
