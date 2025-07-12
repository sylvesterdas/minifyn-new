'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Check, Clipboard, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { generateApiKey, revokeApiKey, getApiKeyForUser } from './actions';

export function ApiKeysCard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, startGenerateTransition] = useTransition();
    const [isRevoking, startRevokeTransition] = useTransition();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (user) {
            getApiKeyForUser(user.uid)
                .then(key => {
                    setApiKey(key);
                    setIsLoading(false);
                });
        }
    }, [user]);

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
        <Card>
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for programmatic access. Remember, you can only have one active key at a time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <p>Loading your API key...</p>
                    </div>
                ) : apiKey ? (
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
            </CardContent>
        </Card>
    );
}
