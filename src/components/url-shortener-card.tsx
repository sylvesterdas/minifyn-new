
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';

export function UrlShortenerCard() {
    return (
         <Link href="/">
            <Card className="h-full hover:border-primary transition-colors group bg-card/50 border-primary/20 shadow-lg hover:shadow-primary/10">
                <CardHeader className="flex flex-row items-start gap-4 p-6">
                    <LinkIcon className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                        <CardTitle className="text-xl flex items-center">
                            URL Shortener 
                            <span className="text-xs font-normal text-primary ml-2 py-0.5 px-1.5 rounded-full bg-primary/10">(Main Tool)</span>
                        </CardTitle>
                        <CardDescription className="mt-2">Our core feature. Create short, powerful, and trackable links. It's fast, free, and easy to use.</CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </CardHeader>
            </Card>
        </Link>
    );
}
