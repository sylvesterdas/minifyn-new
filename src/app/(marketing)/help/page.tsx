import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & FAQ | MiniFyn',
  description: 'Find answers to frequently asked questions about MiniFyn.',
};

const faqs = [
    {
        question: "How do I create a short link?",
        answer: "Simply paste your long URL into the input box on the homepage and click 'Shorten URL'. Your new, shorter link will be generated instantly."
    },
    {
        question: "How do I generate a QR code?",
        answer: "On the homepage, select the 'QR Code' tab. Paste any URL or text into the input box and click 'Generate QR Code'. You can then download the generated image."
    },
    {
        question: "Do I need an account to use the service?",
        answer: "You can create short links and QR codes without an account. However, signing up for a free account allows you to manage your links, view detailed analytics, and access more features."
    },
    {
        question: "How long do my links last?",
        answer: "For anonymous users, links expire after 7 days. For registered users, links do not expire but can be manually paused or deleted from your dashboard."
    },
    {
        question: "How do I view analytics for my links?",
        answer: "If you are a registered user, you can view click analytics by navigating to the 'Analytics' section in your dashboard. This includes data on click counts, referrers, and geographic location."
    },
    {
        question: "Is there a developer API?",
        answer: "Yes! Registered users can generate API keys from the 'Settings' page in their dashboard. Our API allows you to integrate MiniFyn's link shortening capabilities into your own applications."
    }
]

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Help Center</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Frequently Asked Questions
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
