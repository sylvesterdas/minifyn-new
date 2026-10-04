
import type { Metadata } from 'next';
import type { FAQPage, WithContext } from 'schema-dts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LifeBuoy, ShieldAlert, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';



export const metadata: Metadata = {
  title: 'FAQ | MiniFyn Help Center',
  description: 'Answers to common MiniFyn questions about short links, link expiry, analytics, QR codes, the API, Pro plans, billing and account security.',
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
        answer: "Yes. Payments in India are processed by <a href='https://razorpay.com/security/' target='_blank' rel='noopener noreferrer' class='text-primary underline'>Razorpay</a> (UPI, cards and netbanking), and international payments by PayPal. We never store your card details on our servers; all payment data is handled directly by these providers."
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
          <h2 className="sr-only">Questions and answers</h2>
          <div className="w-full">
              {faqs.map((faq) => (
                  <details key={faq.question} className="group border-b">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-medium hover:underline [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <div className="pb-4 text-base text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </details>
              ))}
          </div>

          <section className="mt-16 space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-semibold text-foreground">Getting more from MiniFyn</h2>
            <p>
              MiniFyn turns long, messy URLs into short links you can share anywhere, with QR codes and click analytics built in. Every link is checked against our threat and phishing blocklist before it is created, so the people who click your links stay safe.
            </p>
            <p>
              If your question is about a specific short link, include the link itself when you contact us. For billing questions, mention the email on your account and the payment method you used. Developers can find endpoints, authentication and examples in the <Link href="/docs/api" className="text-primary hover:underline">API documentation</Link>, and step-by-step walkthroughs in our <Link href="/docs/guides" className="text-primary hover:underline">guides</Link>.
            </p>
          </section>

          <div className="mt-16 text-center border-t pt-12">
            <h2 className="text-2xl font-semibold">Still have questions?</h2>
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
