import { UrlShortenerForm } from '@/components/url-shortener-form';
import { QrCodeGeneratorForm } from '@/components/qr-code-generator-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Key, Zap, QrCode, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  return (
    <main className="flex-1">
      <section className="relative w-full py-20 md:py-32 lg:py-40">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_200px,#1e40af33,transparent)] -z-10"></div>
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
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6">
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
              <div key={index} className="grid gap-1 p-4 rounded-lg hover:bg-card/50 transition-colors">
                {feature.icon}
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
                <Link href="/auth/signup">Get started for free</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
