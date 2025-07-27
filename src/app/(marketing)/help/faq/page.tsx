
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';
import type { FAQPage, WithContext } from 'schema-dts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LifeBuoy, ShieldAlert, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';



export const metadata: Metadata = {
  title: 'FAQ | MiniFyn Help Center',
  description: 'Find answers to frequently asked questions about MiniFyn.',
  alternates: {
    canonical: 'https://www.minifyn.com/help/faq',
  },
};

const faqs = [
    {
        question: "How do I create a short link?",
        answer: "Simply paste your long URL into the input box on the <a href='/' class='text-primary underline'>homepage</a> and click 'Shorten URL'. Your new, shorter link will be generated instantly."
    },
    {
        question: "How do I generate a QR code?",
        answer: "On the homepage, select the 'QR Code' tab. Paste any URL or text into the input box and click 'Generate QR Code'. You can then download the generated image."
    },
    {
        question: "Do I need an account to use the service?",
        answer: "You can create a limited number of short links and QR codes without an account. However, <a href='/auth/signup' class='text-primary underline'>signing up</a> for a free account gives you higher limits and allows you to manage your links and view analytics."
    },
    {
        question: "How long do my links last?",
        answer: "On the <strong>Free</strong> plan, links expire after <strong>60 days</strong>. If you upgrade to our <strong>Pro</strong> plan, your links will <strong>never expire</strong>."
    },
    {
        question: "What happens to my Pro links if I cancel my subscription?",
        answer: "If you cancel your Pro subscription, your existing Pro links will <strong>remain active and will not expire</strong>. You will retain the benefit of permanent links for everything created during your subscription period. Any new links you create after your subscription ends will be subject to the Free plan's limits and 60-day expiration."
    },
    {
        question: "What are the daily creation limits?",
        answer: "Anonymous users are limited to <strong>3 links/day</strong>. Users on the <strong>Free</strong> plan can create up to <strong>20 links/day</strong>. <strong>Pro</strong> plan users have a limit of <strong>100 links/day</strong>. These limits also apply to API usage."
    },
    {
        question: "How do I view analytics for my links?",
        answer: "Basic click analytics are available to all registered users in their dashboard. The <strong>Pro</strong> plan unlocks advanced analytics, including referrers, geographic data, and a longer data retention period."
    },
    {
        question: "Is my payment information secure?",
        answer: "Yes, absolutely. We use <a href='https://razorpay.com/security/' target='_blank' rel='noopener noreferrer' class='text-primary underline'>Razorpay</a>, a leading and secure payment gateway, to handle all transactions. We do not store any of your sensitive credit card information on our servers. All payment data is handled directly by Razorpay."
    },
    {
        question: "Is there a developer API?",
        answer: "Yes! All registered users can generate an API key from the 'API Keys' section in their dashboard. Our <a href='/docs/api' class='text-primary underline'>API documentation</a> has everything you need to get started integrating MiniFyn into your applications."
    },
    {
        question: "What happens if I shorten a malicious link?",
        answer: "We have a domain blocklist to prevent the shortening of known malicious URLs. Additionally, users can report abusive links. Violating our <a href='/acceptable-use' class='text-primary underline'>Acceptable Use Policy</a> can result in the link being disabled and the user being banned."
    }
];

export default function FaqPage() {

    const jsonLd: WithContext<FAQPage> = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer.replace(/<[^>]*>?/gm, ''), // Strip HTML for JSON-LD
            }
        }))
    };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
          <div className="mb-12">
              <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
              <p className="mt-2 text-lg text-muted-foreground">Find answers to the most common questions about MiniFyn.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground prose prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </AccordionContent>
                  </AccordionItem>
              ))}
          </Accordion>

          <div className="mt-16 text-center border-t pt-12">
            <h3 className="text-2xl font-semibold">Still have questions?</h3>
            <p className="mt-2 text-muted-foreground">
              If you can't find what you're looking for, we're here to help.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
                <Link href="/help/report-abuse">
                    <Card className="h-full hover:border-primary transition-colors group">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">Report Abuse</CardTitle>
                                <p className="text-sm text-muted-foreground">Report a malicious or abusive link.</p>
                            </div>
                            <ShieldAlert className="h-8 w-8 text-destructive" />
                        </CardHeader>
                    </Card>
                </Link>
                 <Link href="/contact">
                    <Card className="h-full hover:border-primary transition-colors group">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">Contact Support</CardTitle>
                                <p className="text-sm text-muted-foreground">Get in touch with our team directly.</p>
                            </div>
                             <LifeBuoy className="h-8 w-8 text-primary" />
                        </CardHeader>
                    </Card>
                </Link>
            </div>
          </div>
      </div>
    </>
  );
}
