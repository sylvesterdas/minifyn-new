'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Check, Clipboard, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { generateApiKey, revokeApiKey, getApiKeyForUser } from '../actions';

interface ApiKeyClientComponentProps {
    initialApiKey: string | null;
}

export function ApiKeyClientComponent({ initialApiKey }: ApiKeyClientComponentProps) {
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState<string | null>(initialApiKey);
    const [isGenerating, startGenerateTransition] = useTransition();
    const [isRevoking, startRevokeTransition] = useTransition();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setApiKey(initialApiKey);
    }, [initialApiKey]);

    const handleGenerate = () => {
        startGenerateTransition(async () => {
            const result = await generateApiKey();
            if ('key' in result) {
                setApiKey(result.key);
                toast({
                    title: 'API Key Generated',
                    description: 'Your new API key has been created successfully.',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    const handleRevoke = () => {
        startRevokeTransition(async () => {
            const result = await revokeApiKey();
            if ('success' in result) {
                setApiKey(null);
                toast({
                    title: 'API Key Revoked',
                    description: 'Your API key has been successfully revoked.',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        });
    };

    const handleCopy = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <>
            {apiKey ? (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input value={apiKey} readOnly />
                        <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy API Key">
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={handleRevoke}
                        disabled={isRevoking}
                    >
                        {isRevoking && <Loader2 className="mr-2 animate-spin" />}
                        Revoke Key
                    </Button>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-muted-foreground mb-4">You don't have an API key yet. Generate one to get started.</p>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <Loader2 className="mr-2 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2" />
                        )}
                        Generate New Key
                    </Button>
                </div>
            )}
        </>
    );
}
