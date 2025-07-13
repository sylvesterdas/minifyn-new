import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowRight } from 'lucide-react';

export function CtaCard() {
    return (
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <CardHeader>
                <CardTitle>Shorten Your Links, Amplify Your Reach</CardTitle>
                <CardDescription>
                    Tired of long, clunky URLs? Create short, powerful, and trackable links with MiniFyn. It's fast, free, and easy to use.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/">
                        Try It Now <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
