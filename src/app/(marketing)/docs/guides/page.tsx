import { Link as LinkIcon, QrCode } from 'lucide-react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'How-to Guides | MiniFyn Help Center',
  description: 'Step-by-step guides for using MiniFyn features.',
  alternates: {
    canonical: 'https://www.minifyn.com/docs/guides',
  },
};

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
        <div className="mb-12">
            <h1 className="text-4xl font-bold">How-to Guides</h1>
            <p className="mt-2 text-lg text-muted-foreground">Your step-by-step manual for getting the most out of MiniFyn.</p>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl"><LinkIcon className="mr-3 text-primary" /> Shortening a URL</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
                        <li>Navigate to the <a href="/" className="underline">homepage</a>.</li>
                        <li>Ensure the "URL Shortener" tab is selected.</li>
                        <li>Paste your long URL into the input field labeled "URL to shorten".</li>
                        <li>Click the "Shorten URL" button.</li>
                        <li>Your new, short link will appear below the button. You can click the copy icon to copy it to your clipboard.</li>
                    </ol>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl"><QrCode className="mr-3 text-primary" /> Generating a QR Code</CardTitle>
                </CardHeader>
                <CardContent>
                     <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
                        <li>Navigate to the <a href="/" className="underline">homepage</a>.</li>
                        <li>Select the "QR Code" tab.</li>
                        <li>Enter any URL or text into the input field.</li>
                        <li>Click the "Generate QR Code" button.</li>
                        <li>A preview of your QR code will appear. Click the "Download QR Code" button to save it as a PNG image.</li>
                    </ol>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl">Managing Your Links</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-muted-foreground">To manage your links, you must have a free account.</p>
                     <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
                        <li><a href="/auth/signin" className="underline">Sign in</a> to your account.</li>
                        <li>Navigate to the "Dashboard".</li>
                        <li>Click on the "Links" tab in the sidebar to see all your links.</li>
                        <li>Use the action menu (three dots) on each link to copy, edit, or delete it.</li>
                        <li>Click on the "Analytics" tab to view detailed statistics for all your links.</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
