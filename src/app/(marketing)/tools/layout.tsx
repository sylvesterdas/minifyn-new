
import { RelatedTools } from '@/components/related-tools';
import Link from 'next/link';

export default function ToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <div className="container mx-auto px-4">
                 <div className="mt-8 max-w-4xl mx-auto text-center">
                    <p className="text-xs text-muted-foreground">
                        Your privacy is important. Our developer tools process everything in your browser, so your code never leaves your computer. Use of these tools is subject to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
                    </p>
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
