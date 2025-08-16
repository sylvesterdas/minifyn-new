
import { CodeMinifier } from '@/components/code-minifier';
import { Disclaimer } from '@/components/disclaimer';
import { RelatedTools } from '@/components/related-tools';
import type { Metadata } from 'next';
import { AdsenseAd } from '@/components/adsense-ad';

export const metadata: Metadata = {
    title: 'Code Minifier | MiniFyn Tools',
    description: 'Minify single or multiple JavaScript, CSS, HTML, and JSON files for production with our fast, client-side tool. Reduce file sizes and improve your website\'s performance for free.',
    alternates: {
        canonical: 'https://www.minifyn.com/tools/code-minifier',
    },
};

export default function CodeMinifierPage() {
    return (
        <>
            <div className="container mx-auto px-4 py-12 md:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Code Minifier</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        Minify JS, CSS, HTML, and JSON files. Select multiple files to download a zip, or paste single snippets below. All processing is done securely in your browser.
                    </p>
                </div>
                
                <CodeMinifier />
            </div>

            <div className="container mx-auto px-4">
                <Disclaimer />
            </div>
            
            <div className="container mx-auto px-4 my-8 text-center">
                 <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
                 <div className="mx-auto bg-muted/20 flex items-center justify-center min-h-[250px] max-w-4xl">
                    <AdsenseAd adClient="ca-pub-4781198854082500" adSlot="1558786722" />
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
