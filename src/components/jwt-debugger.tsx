
'use client';

import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';

function DecodedSection({ title, data }: { title: string; data: object | null }) {
    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <pre className="w-full p-4 rounded-md bg-muted text-sm overflow-x-auto hljs">
                <code className="language-json">
                    {data ? JSON.stringify(data, null, 2) : ''}
                </code>
            </pre>
        </div>
    );
}

export function JwtDebugger() {
    const [token, setToken] = useState('');

    const { decodedHeader, decodedPayload, error } = useMemo(() => {
        if (!token.trim()) {
            return { decodedHeader: null, decodedPayload: null, error: null };
        }
        try {
            const header = jwtDecode(token, { header: true });
            const payload = jwtDecode<JwtPayload>(token);
            return { decodedHeader: header, decodedPayload: payload, error: null };
        } catch (e: any) {
            return { decodedHeader: null, decodedPayload: null, error: e.message || 'Invalid token' };
        }
    }, [token]);
    
    const isExpired = useMemo(() => {
        if (!decodedPayload?.exp) return null;
        return decodedPayload.exp * 1000 < Date.now();
    }, [decodedPayload]);

    const getStatusColor = () => {
        if (error) return 'bg-destructive/10 text-destructive border-destructive/20';
        if (isExpired) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        return 'bg-green-500/10 text-green-400 border-green-500/20';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                           <Shield className="h-6 w-6 text-primary" /> JWT Decoder
                        </CardTitle>
                        <CardDescription className="mt-2">Your token is never sent to our servers.</CardDescription>
                    </div>
                     {token && (
                        <Badge variant="secondary" className={getStatusColor()}>
                            {error ? 'Invalid Token' : isExpired ? 'Expired' : 'Valid Signature'}
                        </Badge>
                     )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-[2fr_3fr] gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Encoded Token</h3>
                        <Textarea
                            placeholder="Paste your JWT here..."
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="h-80 font-mono text-xs"
                            aria-label="JWT Input"
                        />
                        {error && (
                            <p className="mt-2 text-sm text-destructive flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </p>
                        )}
                        {decodedPayload?.exp && (
                            <div className={`mt-2 text-sm flex items-center gap-2 ${isExpired ? 'text-yellow-400' : 'text-green-400'}`}>
                                <CheckCircle className="h-4 w-4" />
                                {isExpired ? 'Expired on' : 'Expires on'}: {format(new Date(decodedPayload.exp * 1000), 'MMM d, yyyy, h:mm:ss a')}
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        <DecodedSection title="Header" data={decodedHeader} />
                        <DecodedSection title="Payload" data={decodedPayload} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
