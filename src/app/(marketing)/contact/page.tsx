import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileQuestion, LifeBuoy } from 'lucide-react';
import type { ContactPage, WithContext } from 'schema-dts';



export const metadata: Metadata = {
  title: 'Contact Us | MiniFyn',
  description: 'Get in touch with the MiniFyn team.',
  alternates: {
    canonical: 'https://www.minifyn.com/contact',
  },
};

export default function ContactPage() {
  const jsonLd: WithContext<ContactPage> = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: 'https://www.minifyn.com/contact',
    name: 'Contact MiniFyn',
    description: 'Get in touch with the MiniFyn team for support, feedback, or inquiries.',
    publisher: {
      '@type': 'Organization',
      name: 'MiniFyn',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.minifyn.com/logo.png',
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="first-name">First name</Label>
              <div className="mt-2.5">
                <Input type="text" name="first-name" id="first-name" autoComplete="given-name" />
              </div>
            </div>
            <div>
              <Label htmlFor="last-name">Last name</Label>
              <div className="mt-2.5">
                <Input type="text" name="last-name" id="last-name" autoComplete="family-name" />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <div className="mt-2.5">
              <Input type="email" name="email" id="email" autoComplete="email" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="message">Message</Label>
            <div className="mt-2.5">
              <Textarea name="message" id="message" rows={4} />
            </div>
          </div>
          <div className="mt-10">
            <Button type="submit" className="w-full">
              Send message
            </Button>
          </div>
        </form>
      </div>
      
      <div className="container mx-auto px-4 pb-12 md:pb-24">
        <div className="mt-16 text-center border-t pt-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold">Need a faster answer?</h3>
          <p className="mt-2 text-muted-foreground">
            Check our FAQ for answers to common questions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/help/faq">
                <FileQuestion className="mr-2 h-4 w-4" />
                Read our FAQ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
