
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { ArrowRight, Code, Wand2, Link as LinkIcon, Shield } from 'lucide-react';
import Link from 'next/link';
import { AdsenseAd } from './adsense-ad';
import { trackEvent } from '@/lib/gtag';
import React from 'react';

export function BlogScrollCta() {
    const [isOpen, setIsOpen] = useState(false);
    const hasTriggered = useRef(false);
    const adClient = "ca-pub-4781198854082500";
    const adSlot = "1558786722";

    const handleScroll = useCallback(() => {
        if (hasTriggered.current) return;

        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage > 25) {
            setIsOpen(true);
            hasTriggered.current = true;
            trackEvent({
                action: 'show_scroll_cta',
                category: 'blog_engagement',
                label: 'Scrolled past 25%'
            });
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent 
                className="max-w-2xl p-0" 
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                hideCloseButton={true}
            >
                <div className="grid md:grid-cols-2">
                    <div className="p-6 flex flex-col justify-center bg-muted/30 order-last md:order-first">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2"><Wand2 className="text-primary"/>Liked this article?</DialogTitle>
                            <DialogDescription className="pt-2">
                                Check out our suite of free, privacy-first developer tools. No sign-up required.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                           <Button asChild variant="secondary" className="w-full justify-start">
                               <Link href="/">
                                   <LinkIcon className="mr-2"/> URL Shortener
                               </Link>
                           </Button>
                           <Button asChild variant="secondary" className="w-full justify-start hidden md:flex">
                               <Link href="/tools" target="_blank" rel="noopener noreferrer">
                                   <Code className="mr-2"/> Explore All Dev Tools
                               </Link>
                           </Button>
                        </div>
                         <DialogClose asChild>
                            <Button variant="link" className="text-muted-foreground mt-4">
                                No thanks, continue reading
                            </Button>
                        </DialogClose>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l">
                         <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
                        <div className="w-full h-[250px] md:h-full flex items-center justify-center">
                            <AdsenseAd adSlot={adSlot!} adClient={adClient!} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// We need to modify the DialogContent to conditionally hide the close button
const OriginalDialogContent = DialogContent;
const ModifiedDialogContent = React.forwardRef<
  React.ElementRef<typeof OriginalDialogContent>,
  React.ComponentPropsWithoutRef<typeof OriginalDialogContent> & { hideCloseButton?: boolean }
>(({ hideCloseButton, children, ...props }, ref) => (
  <OriginalDialogContent ref={ref} {...props}>
    {children}
    {!hideCloseButton && (
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogClose>
    )}
  </OriginalDialogContent>
));
ModifiedDialogContent.displayName = 'DialogContent';

// Overwrite the named export
(Dialog as any).Content = ModifiedDialogContent;
