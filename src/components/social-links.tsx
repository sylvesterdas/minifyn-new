import { Twitter, Facebook, Linkedin, Send } from 'lucide-react';
import { Button } from './ui/button';

export function SocialLinks() {
    const socialLinks = {
        twitter: 'https://x.com/minifyncom',
        facebook: 'https://facebook.com/minifyncom',
        linkedin: 'https://linkedin.com/company/minifyn',
        telegram: 'https://t.me/minifyn',
    };

    return (
        <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="icon" asChild>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Follow on X (formerly Twitter)">
                    <Twitter className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Follow on Facebook">
                    <Facebook className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Follow on LinkedIn">
                    <Linkedin className="h-5 w-5" />
                </a>
            </Button>
             <Button variant="outline" size="icon" asChild>
                <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" aria-label="Join on Telegram">
                    <Send className="h-5 w-5" />
                </a>
            </Button>
        </div>
    );
}
