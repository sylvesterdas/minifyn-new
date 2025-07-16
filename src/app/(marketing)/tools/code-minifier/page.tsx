import { CodeMinifier } from '@/components/code-minifier';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Code Minifier | MiniFyn Tools',
    description: 'Minify single or multiple JavaScript and CSS files for production with our fast, client-side tool. Reduce file sizes and improve your website\'s performance for free.',
    alternates: {
        canonical: 'https://www.minifyn.com/tools/code-minifier',
    },
};

export default function CodeMinifierPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Code Minifier</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Minify multiple JS/CSS files and download a zip, or paste your code below to instantly minify it. All processing is done securely in your browser.
                </p>
            </div>
            
            <CodeMinifier />
        </div>
    );
}
