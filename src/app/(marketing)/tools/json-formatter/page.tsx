
import { JsonFormatter } from '@/components/json-formatter';
import { Disclaimer } from '@/components/disclaimer';
import { RelatedTools } from '@/components/related-tools';
import type { Metadata } from 'next';
import { AdsenseAd } from '@/components/adsense-ad';

export const metadata: Metadata = {
    title: 'JSON Formatter & Validator | MiniFyn Tools',
    description: 'Format, prettify, and validate your JSON data with our fast, client-side tool. Clean up messy JSON, identify errors, and make your data readable for free.',
    alternates: {
        canonical: 'https://www.minifyn.com/tools/json-formatter',
    },
};

export default function JsonFormatterPage() {
    return (
        <>
            <div className="container mx-auto px-4 py-12 md:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">JSON Formatter & Validator</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Paste your JSON below to format it beautifully and check for any syntax errors. All processing is done securely in your browser.
                    </p>
                </div>
                
                <JsonFormatter />
            </div>

            <div className="container mx-auto px-4">
                <Disclaimer />
            </div>

            <div className="container mx-auto px-4 my-8 text-center">
                 <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
                 <div className="mx-auto bg-muted/20 flex items-center justify-center min-h-[250px] max-w-4xl">
                    <AdsenseAd adClient="ca-pub-4781198854082500" adSlot="2222222222" />
                 </div>
            </div>

             <div className="py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <RelatedTools />
                </div>
            </div>
        </>
    );
}
