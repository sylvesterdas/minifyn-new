
'use client';

import { useState, useTransition, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, Loader2, ArrowRight, Clipboard, Check, Trash2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { trackEvent } from '@/lib/gtag';

export function JsonFormatter() {
    const [inputJson, setInputJson] = useState('');
    const [outputJson, setOutputJson] = useState('');
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const { toast } = useToast();

    const handleFormat = useCallback(() => {
        if (!inputJson.trim()) {
            setOutputJson('');
            setStatus('idle');
            setErrorMessage('');
            return;
        }

        startTransition(() => {
            try {
                const parsedJson = JSON.parse(inputJson);
                const formattedJson = JSON.stringify(parsedJson, null, 2);
                setOutputJson(formattedJson);
                setStatus('success');
                setErrorMessage('');
                trackEvent({ action: 'format_json_success', category: 'dev_tools', label: 'json_formatter' });
            } catch (error: any) {
                setOutputJson('');
                setStatus('error');
                // Provide a more user-friendly error message
                const message = error.message.replace(/at position \d+/, (match: string) => `near ${match}`);
                setErrorMessage(`Invalid JSON: ${message}`);
            }
        });
    }, [inputJson]);

    const handleCopy = () => {
        if (outputJson) {
            navigator.clipboard.writeText(outputJson).then(() => {
                setCopied(true);
                toast({ title: 'Copied!', description: 'Formatted JSON copied to clipboard.' });
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const handleDownload = () => {
        if (outputJson) {
            const blob = new Blob([outputJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'formatted.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const handleClear = () => {
        setInputJson('');
        setOutputJson('');
        setStatus('idle');
        setErrorMessage('');
    };

    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-2xl"><Wand2 className="h-6 w-6 text-primary"/> Pretty JSON</CardTitle>
                        <CardDescription className="mt-2">Paste messy JSON, get back clean, readable code.</CardDescription>
                    </div>
                    {status === 'success' && <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Valid JSON</Badge>}
                    {status === 'error' && <Badge variant="destructive">Invalid JSON</Badge>}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Input Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Input</h3>
                            <Button variant="ghost" size="icon" onClick={handleClear} disabled={!inputJson && !outputJson}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Clear</span>
                            </Button>
                        </div>
                        <Textarea
                            placeholder='{ "paste": "your", "messy": [ "JSON", "here" ] }'
                            value={inputJson}
                            onChange={(e) => setInputJson(e.target.value)}
                            className="h-80 font-mono text-xs"
                            aria-label="JSON Input"
                        />
                        <Button onClick={handleFormat} disabled={isPending || !inputJson} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Format & Validate
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Output</h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!outputJson}>
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                                    <span className="sr-only">Copy</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!outputJson}>
                                    <FileDown className="h-4 w-4" />
                                    <span className="sr-only">Download</span>
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            placeholder="Clean JSON will appear here..."
                            value={outputJson}
                            readOnly
                            className="h-80 font-mono text-xs bg-muted/50"
                            aria-label="JSON Output"
                        />
                         {status === 'error' && errorMessage && (
                            <p className="text-sm text-destructive font-mono text-center p-2 bg-destructive/10 rounded-md animate-in fade-in duration-500">
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
