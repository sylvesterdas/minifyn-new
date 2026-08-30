
import { JwtDebugger } from '@/components/jwt-debugger';
import { Disclaimer } from '@/components/disclaimer';
import { RelatedTools } from '@/components/related-tools';
import type { Metadata } from 'next';
import { AdsenseAd } from '@/components/adsense-ad';
import { ToolSeo } from '@/components/tool-seo';

export const metadata: Metadata = {
    title: 'JWT Debugger | MiniFyn Tools',
    description: 'Decode and inspect JSON Web Tokens (JWTs) instantly. A secure, client-side tool to validate and debug your tokens without ever sending data to a server.',
    alternates: {
        canonical: 'https://www.minifyn.com/tools/jwt-debugger',
    },
    openGraph: { title: 'JWT Debugger Online | MiniFyn', description: 'Decode JWT headers and payloads locally without uploading tokens.', url: 'https://www.minifyn.com/tools/jwt-debugger', type: 'website', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', title: 'JWT Debugger | MiniFyn', description: 'Decode JWTs locally and safely.', images: ['/og.png'] },
};

export default function JwtDebuggerPage() {
    return (
        <>
            <div className="container mx-auto px-4 py-12 md:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">JWT Debugger</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Paste a JSON Web Token to decode and inspect its header and payload. All processing is done securely in your browser.
                    </p>
                </div>
                
                <JwtDebugger />
                <ToolSeo title="JWT Debugger" description="When your integration is ready, use the MiniFyn developer API to create short links programmatically." cta="Connect your tools with the MiniFyn API" href="/docs/api" />
            </div>

            <div className="container mx-auto px-4">
                <Disclaimer />
            </div>
            
            <div className="container mx-auto px-4 my-8 text-center">
                 <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
                 <div className="mx-auto bg-muted/20 flex items-center justify-center min-h-[250px] max-w-4xl">
                    <AdsenseAd adClient="ca-pub-4781198854082500" adSlot="5650074977" />
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
