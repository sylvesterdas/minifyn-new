
import { Link as LinkIcon, QrCode, HardDrive, Key } from 'lucide-react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';



export const metadata: Metadata = {
  title: 'How-to Guides | MiniFyn Help Center',
  description: 'Step-by-step guides for using MiniFyn features.',
  alternates: {
    canonical: 'https://www.minifyn.com/docs/guides',
  },
};

const navLinks = [
    { name: 'Shortening a URL', href: '#shorten-url' },
    { name: 'Generating a QR Code', href: '#generate-qr' },
    { name: 'Managing Your Links', href: '#manage-links' },
    { name: 'Using the API', href: '#using-api' },
];

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_3fr] gap-12">
            <aside className="lg:sticky lg:top-24 lg:self-start">
                <nav>
                    <ul className="space-y-3">
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <a href={link.href} className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                                    {link.name}
                                </a>
                            </li>
                         ))}
                    </ul>
                </nav>
            </aside>

             <main className="space-y-12">
                <header>
                    <h1 className="text-4xl font-bold">How-to Guides</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Your step-by-step manual for getting the most out of MiniFyn.</p>
                </header>
                
                <section id="shorten-url" className="scroll-mt-24">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl"><LinkIcon className="mr-3 text-primary" /> Shortening a URL</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
                                <li>Navigate to the <a href="/" className="underline text-primary">homepage</a>.</li>
                                <li>Ensure the "URL Shortener" tab is selected.</li>
                                <li>Paste your long URL into the input field labeled "URL to shorten".</li>
                                <li>Click the "Shorten URL" button.</li>
                                <li>Your new, short link will appear below the button. You can click the copy icon to copy it to your clipboard.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </section>

                <section id="generate-qr" className="scroll-mt-24">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl"><QrCode className="mr-3 text-primary" /> Generating a QR Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
                                <li>Navigate to the <a href="/" className="underline text-primary">homepage</a>.</li>
                                <li>Select the "QR Code" tab.</li>
                                <li>Enter any URL or text into the input field.</li>
                                <li>Click the "Generate QR Code" button.</li>
                                <li>A preview of your QR code will appear. Click the "Download QR Code" button to save it as a PNG image.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </section>

                <section id="manage-links" className="scroll-mt-24">
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center text-2xl"><HardDrive className="mr-3 text-primary" /> Managing Your Links</CardTitle>
                             <CardDescription>To manage your links, you must have a free account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
                                <li><Link href="/auth/signin" className="underline text-primary">Sign in</Link> to your account.</li>
                                <li>Navigate to the "Dashboard".</li>
                                <li>Click on the "Links" tab in the sidebar to see all your links.</li>
                                <li>Use the action menu (three dots) on each link to copy, edit, or delete it.</li>
                                <li>Click on the "Analytics" tab to view detailed statistics for all your links.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </section>
                
                 <section id="using-api" className="scroll-mt-24">
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center text-2xl"><Key className="mr-3 text-primary" /> Using the API</CardTitle>
                             <CardDescription>To use the API, you must have a registered account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-base">
                                <li><Link href="/auth/signin" className="underline text-primary">Sign in</Link> to your account.</li>
                                <li>Navigate to <Link href="/dashboard/settings/api-keys" className="underline text-primary">Settings &gt; API Keys</Link>.</li>
                                <li>Click the "Generate New Key" button to get your API key.</li>
                                <li>Use this key in the `Authorization: Bearer YOUR_API_KEY` header when making requests.</li>
                                <li>For detailed endpoint information, refer to our full <Link href="/docs/api" className="underline text-primary">API Documentation</Link>.</li>
                            </ol>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    </div>
  );
}
