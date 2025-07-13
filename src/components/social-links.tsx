import { Twitter, Github, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

export function SocialLinks() {
    // Replace with your actual social media links
    const socialLinks = {
        twitter: 'https://twitter.com/your-profile',
        github: 'https://github.com/your-profile',
        linkedin: 'https://linkedin.com/in/your-profile',
    };

    return (
        <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="icon" asChild>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Follow on Twitter">
                    <Twitter className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="Follow on GitHub">
                    <Github className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Follow on LinkedIn">
                    <Linkedin className="h-5 w-5" />
                </a>
            </Button>
        </div>
    );
}
