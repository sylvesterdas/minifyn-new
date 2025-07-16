
import { JwtDebugger } from '@/components/jwt-debugger';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JWT Debugger | MiniFyn Tools',
    description: 'Decode and inspect JSON Web Tokens (JWTs) instantly. A secure, client-side tool to validate and debug your tokens without ever sending data to a server.',
    alternates: {
        canonical: 'https://www.minifyn.com/tools/jwt-debugger',
    },
};

export default function JwtDebuggerPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">JWT Debugger</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Paste a JSON Web Token to decode and inspect its header and payload. All processing is done securely in your browser.
                </p>
            </div>
            
            <JwtDebugger />
        </div>
    );
}
