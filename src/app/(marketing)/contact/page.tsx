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
  description: 'Contact the MiniFyn team for account help, billing questions, abuse reports, partnerships or feedback on ScamGuard, ClipFyn and CensorFyn.',
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

        <section className="mt-16 space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-semibold text-foreground">How we can help</h2>
          <p>
            Write to us about account access, Pro billing and payments, API keys, short links that are not redirecting, or questions about ScamGuard, ClipFyn and CensorFyn. Partnership requests and product feedback are always welcome.
          </p>
          <p>
            To help us answer quickly, include the short link or app involved, your device and browser or app version, and any error message you saw. Please never send passwords, one-time codes or full card numbers.
          </p>
          <p>
            To report a phishing, malware or spam link created with MiniFyn, use the <Link href="/help/report-abuse" className="text-primary hover:underline">Report Abuse</Link> page so it reaches our review team directly.
          </p>
        </section>
      </div>
      
      <div className="container mx-auto px-4 pb-12 md:pb-24">
        <div className="mt-16 text-center border-t pt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold">Need a faster answer?</h2>
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
