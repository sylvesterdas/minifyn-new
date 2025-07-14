import { Twitter, Facebook, Linkedin, Send, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

export function SocialLinks() {
    const socialLinks = {
        twitter: 'https://x.com/minifyncom',
        facebook: 'https://facebook.com/minifyncom',
        linkedin: 'https://linkedin.com/company/minifyn',
        telegram: 'https://t.me/minifyn',
    };
    
    const renderLink = (href: string, label: string, Icon: React.ElementType) => (
         <Button variant="outline" size="icon" asChild>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="relative group">
                <Icon className="h-5 w-5" />
                <ExternalLink className="absolute -top-1 -right-1 h-3 w-3 bg-background text-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
        </Button>
    )

    return (
        <div className="flex justify-center items-center gap-2">
            {renderLink(socialLinks.twitter, 'Follow on X (formerly Twitter)', Twitter)}
            {renderLink(socialLinks.facebook, 'Follow on Facebook', Facebook)}
            {renderLink(socialLinks.linkedin, 'Follow on LinkedIn', Linkedin)}
            {renderLink(socialLinks.telegram, 'Join on Telegram', Send)}
        </div>
    );
}
