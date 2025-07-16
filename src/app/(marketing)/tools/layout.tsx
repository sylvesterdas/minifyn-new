
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
                        This tool operates entirely in your browser. We do not upload or store any of your code or files. While we strive for accuracy, MiniFyn is not liable for any errors, data loss, or damages resulting from its use. By using this tool, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
                    </p>
                </div>
            </div>
            
            <div className="py-12 md:py-16 bg-muted/20">
                 <div className="container mx-auto px-4 max-w-4xl">
                    <RelatedTools />
                 </div>
            </div>
        </>
    );
}
