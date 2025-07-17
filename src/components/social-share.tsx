
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Twitter, Linkedin, Facebook, Link as LinkIcon, Send, ExternalLink } from 'lucide-react'; // Using Send for Reddit
import { trackEvent } from '@/lib/gtag';

interface SocialShareProps {
    url: string;
    title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            toast({
                title: 'Copied!',
                description: 'Link copied to clipboard.',
            });
            trackEvent({
                action: 'copy_share_link',
                category: 'blog_engagement',
                label: `Article: ${title}`,
            });
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            toast({
                title: 'Error',
                description: 'Could not copy link to clipboard.',
                variant: 'destructive',
            });
        });
    };
    
    const trackShareClick = (platform: string) => {
        trackEvent({
            action: 'click_share_button',
            category: 'blog_engagement',
            label: `Platform: ${platform} - Article: ${title}`
        });
    }

    const renderShareButton = (platform: keyof typeof shareLinks, label: string, Icon: React.ElementType) => (
        <Button variant="outline" size="icon" asChild>
            <a 
              href={shareLinks[platform]} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={label} 
              className="relative group"
              onClick={() => trackShareClick(platform)}
            >
                <Icon className="h-5 w-5" />
                 <ExternalLink className="absolute -top-1 -right-1 h-3 w-3 bg-background text-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
        </Button>
    );

    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Share this article</h3>
            <div className="flex justify-center items-center gap-2 flex-wrap">
                {renderShareButton('twitter', 'Share on Twitter', Twitter)}
                {renderShareButton('linkedin', 'Share on LinkedIn', Linkedin)}
                {renderShareButton('facebook', 'Share on Facebook', Facebook)}
                {renderShareButton('reddit', 'Share on Reddit', Send)}
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy link">
                    <LinkIcon className={`h-5 w-5 ${copied ? 'text-green-500' : ''}`} />
                </Button>
            </div>
        </div>
    );
}
