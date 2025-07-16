import { JsonFormatter } from '@/components/json-formatter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JSON Formatter & Validator | MiniFyn Tools',
    description: 'Format, prettify, and validate your JSON data with our fast, client-side tool. Clean up messy JSON, identify errors, and make your data readable for free.',
    alternates: {
        canonical: 'https://www.minifyn.com/tools/json-formatter',
    },
};

export default function JsonFormatterPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">JSON Formatter & Validator</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Paste your JSON below to format it beautifully and check for any syntax errors. All processing is done securely in your browser.
                </p>
            </div>
            
            <JsonFormatter />
        </div>
    );
}
