import { UrlShortenerForm } from '@/components/url-shortener-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BarChart, Key, Zap } from 'lucide-react';
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
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Custom Slugs',
    description: 'Brand your links with custom slugs that are easy to remember and share.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Zap className="h-6 w-6 text-primary" />
            <span className="ml-2 font-bold">MiniFyn</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <Button variant="ghost" asChild>
                <Link href="/#features">Features</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/blog">Blog</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_200px,#1e40af33,transparent)] -z-10"></div>
           <div className="container px-4 md:px-6">
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
                 <UrlShortenerForm />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-900/50">
          <div className="container px-4 md:px-6">
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
          </div>
        </section>

      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} MiniFyn. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
