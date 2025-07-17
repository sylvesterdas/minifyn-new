
import { UrlShortenerForm } from '@/components/url-shortener-form';
import { QrCodeGeneratorForm } from '@/components/qr-code-generator-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Key, Zap, QrCode, Link as LinkIcon, ClipboardPaste, Wand, BarChart3 } from 'lucide-react';
import { DeveloperApiSection } from '@/components/developer-api-section';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { WebSite, WithContext } from 'schema-dts';

export const revalidate = 0;

const siteTitle = 'MiniFyn - Simple URL Shortener';
const siteDescription = 'The simplest way to shorten, share, and track your links.';
const siteUrl = 'https://www.minifyn.com';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: 'MiniFyn',
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/og.png`],
  },
};

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Blazing Fast Shortening',
    description: 'Create short, memorable links in seconds with our optimized service.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Powerful Analytics',
    description: 'Track every click and gain insights into your audience with detailed analytics.',
  },
  {
    icon: <Key className="h-8 w-8 text-primary" />,
    title: 'Developer API',
    description: 'Integrate our shortening service into your own applications with a simple API.',
  },
  {
    icon: <QrCode className="h-8 w-8 text-primary" />,
    title: 'QR Code Generation',
    description: 'Instantly generate a QR code for any shortened link, completely free.',
  },
];

export default function Home() {
    const jsonLd: WithContext<WebSite> = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://www.minifyn.com/',
        name: 'MiniFyn',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.minifyn.com/blog?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string',
        },
    };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_50%,hsl(var(--primary)/0.15),transparent)]"></div>
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <h2 className="text-[20vw] font-bold text-primary/20 select-none">MiniFyn</h2>
            </div>
          </div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  The Ultimate Link Shortener
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Create, share, and track your links with the most powerful and simple-to-use platform.
                </p>
              </div>
              <div className="w-full max-w-md pt-8">
                 <Tabs defaultValue="shortener" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="shortener"><LinkIcon className="h-4 w-4 mr-2"/>URL Shortener</TabsTrigger>
                      <TabsTrigger value="qr-code"><QrCode className="h-4 w-4 mr-2"/>QR Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="shortener">
                      <UrlShortenerForm />
                    </TabsContent>
                    <TabsContent value="qr-code">
                      <QrCodeGeneratorForm />
                    </TabsContent>
                  </Tabs>
                  <p className="text-xs text-muted-foreground mt-4 px-2">
                    By using our tools, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link> and <Link href="/acceptable-use" className="underline hover:text-foreground">Acceptable Use Policy</Link>.
                  </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative w-full py-12 md:py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_50%,hsl(var(--primary)/0.1),transparent)]"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get Started in 3 Simple Steps</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Shortening your URLs with MiniFyn is quick, easy, and intuitive.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-3 md:gap-12 pt-16">
              <div className="grid gap-2 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                    <ClipboardPaste className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">1. Paste URL</h3>
                <p className="text-muted-foreground">
                  Simply paste your long, cumbersome URL into the input field on our homepage.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex justify-center items-center mb-4">
                   <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                    <Wand className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">2. Create Link</h3>
                <p className="text-muted-foreground">
                  Click the "Shorten URL" button and watch as we instantly generate a short, shareable link.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex justify-center items-center mb-4">
                   <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                    <BarChart3 className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold">3. Track Clicks</h3>
                <p className="text-muted-foreground">
                  Share your new link and monitor its performance with our detailed analytics dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative w-full py-12 md:py-24 lg:py-32 bg-card/50">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_50%,hsl(var(--primary)/0.05),transparent)]"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From robust analytics to developer-friendly APIs, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 pt-12">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-1 p-4 rounded-lg hover:bg-card transition-colors">
                  {feature.icon}
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <DeveloperApiSection />

      </main>
    </>
  );
}
