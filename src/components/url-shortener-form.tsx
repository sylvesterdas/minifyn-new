'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { shortenUrl } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clipboard, Check, Zap } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full font-semibold" disabled={pending}>
            {pending ? 'Shortening...' : 'Shorten URL'}
            {!pending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
    );
}

export function UrlShortenerForm() {
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const initialState = { success: false, message: '', shortUrl: '' };
    const [state, formAction] = useFormState(shortenUrl, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.success && state.shortUrl) {
                setShortenedUrl(state.shortUrl);
                formRef.current?.reset();
            } else if (!state.success) {
                toast({
                    title: "Oops!",
                    description: state.message,
                    variant: "destructive",
                });
            }
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
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/20 shadow-2xl shadow-black/20">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                    <Zap className="text-primary" />
                    MiniFyn
                </CardTitle>
                <CardDescription className="text-center pt-2">
                    The simplest way to shorten and share your links.
                </CardDescription>
            </CardHeader>
            <form ref={formRef} action={formAction} onSubmit={(e) => {
                setShortenedUrl(null);
                formAction(new FormData(e.currentTarget));
            }}>
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
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <SubmitButton />
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
