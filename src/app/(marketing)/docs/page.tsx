import { Key, BookOpen, ArrowRight, FileQuestion, LifeBuoy } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';



export const metadata: Metadata = {
  title: 'Documentation | MiniFyn',
  description: 'Explore our guides and API documentation to get the most out of MiniFyn.',
  alternates: {
    canonical: 'https://www.minifyn.com/docs',
  },
};

const docSections = [
    {
        href: '/docs/guides',
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        title: 'How-to Guides',
        description: 'Step-by-step tutorials on how to use our features.'
    },
    {
        href: '/docs/api',
        icon: <Key className="h-8 w-8 text-primary" />,
        title: 'API Documentation',
        description: 'Integrate our service with your own applications.'
    },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Documentation</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to get started and build with MiniFyn.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {docSections.map((section) => (
             <Link href={section.href} key={section.title}>
                <Card className="h-full hover:border-primary transition-colors group">
                    <CardHeader className="flex flex-row items-start gap-4">
                        {section.icon}
                        <div className="flex-1">
                            <CardTitle className="text-xl">{section.title}</CardTitle>
                            <CardDescription className="mt-2">{section.description}</CardDescription>
                        </div>
                         <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </CardHeader>
                </Card>
            </Link>
        ))}
      </div>

      <section className="mt-16 space-y-4 text-muted-foreground leading-relaxed">
        <h2 className="text-2xl font-semibold text-foreground">Getting started with MiniFyn</h2>
        <p>
          The how-to guides walk through everyday tasks step by step: checking a shortened link before you open it, preparing videos for Reels and Shorts with ClipFyn, redacting personal information and removing location data with CensorFyn, and using ScamGuard to spot risky links and QR codes.
        </p>
        <p>
          The API reference is for developers who want to create short links from their own apps, scripts or browser extensions. Requests to <code>POST /api/shorten</code> are authenticated with an API key sent as a Bearer token, and the reference covers request fields, responses, error codes and rate limits.
        </p>
        <p>
          Developer guides for decoding JWTs and formatting JSON pair with the free browser-based tools, so you can learn the concept and try it straight away without uploading your data.
        </p>
      </section>

      <div className="mt-16 text-center border-t pt-12">
        <h2 className="text-2xl font-semibold">Need More Help?</h2>
        <p className="mt-2 text-muted-foreground">
          If you can't find what you're looking for, check out these resources.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/help/faq">
              <FileQuestion className="mr-2 h-4 w-4" />
              Read our FAQ
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <LifeBuoy className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
