import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Report Abuse | MiniFyn Help Center',
  description: 'How to report malicious or abusive links created with MiniFyn.',
};

export default function ReportAbusePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
        <div className="mb-12">
            <h1 className="text-4xl font-bold">Report Abuse</h1>
            <p className="mt-2 text-lg text-muted-foreground">Help us keep the internet safe.</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Reporting Violations</CardTitle>
                <CardDescription>
                    If you've found a MiniFyn link that violates our <Link href="/acceptable-use" className="underline">Acceptable Use Policy</Link>, please let us know immediately. We take reports of spam, phishing, malware, and other illegal or abusive content very seriously.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">How to File a Report</h3>
                <p className="text-muted-foreground">
                    To report a link, please go to our contact page and provide the following information in your message:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>The full, abusive MiniFyn URL (e.g., `minifyn.io/xxxxxx`).</li>
                    <li>A brief description of why the link is abusive (e.g., "This link leads to a phishing site impersonating my bank.").</li>
                    <li>The destination URL, if you know it and feel it's safe to share.</li>
                </ul>
                <p className="text-muted-foreground">
                    Our team will review your report and take appropriate action as quickly as possible, which may include disabling the link and banning the user account associated with it.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/contact">Go to Contact Page <ArrowRight className="ml-2"/></Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
