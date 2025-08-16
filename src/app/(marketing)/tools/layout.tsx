
import { AdsenseAd } from '@/components/adsense-ad';

export default function ToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <div className="container mx-auto px-4 my-8 text-center">
                 <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
                 <div className="mx-auto bg-muted/20 flex items-center justify-center min-h-[250px] max-w-4xl">
                    <AdsenseAd adClient="ca-pub-4781198854082500" adSlot="1558786722" />
                 </div>
            </div>
        </>
    );
}
