import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, FileQuestion, LifeBuoy, ShieldAlert, Link as LinkIcon, QrCode } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Help Center | MiniFyn',
  description: 'Find answers, guides, and support for MiniFyn.',
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
    },
    {
        question: "What happens if I shorten a malicious link?",
        answer: "We have a domain blocklist to prevent the shortening of known malicious URLs. Additionally, users can report abusive links. Violating our Acceptable Use Policy can result in the link being disabled and the user being banned."
    }
]

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Help Center</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your guide to everything MiniFyn.
        </p>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-12">
          <TabsTrigger value="faq" className="py-2.5"><FileQuestion className="mr-2"/> FAQ</TabsTrigger>
          <TabsTrigger value="how-to" className="py-2.5"><LifeBuoy className="mr-2"/> How to Use</TabsTrigger>
          <TabsTrigger value="report" className="py-2.5"><ShieldAlert className="mr-2"/> Report Abuse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="pt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="how-to" className="pt-8">
            <Card>
                <CardHeader>
                    <CardTitle>How to Use MiniFyn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center"><LinkIcon className="mr-2 text-primary" /> Shortening a URL</h3>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Navigate to the homepage.</li>
                            <li>Ensure the "URL Shortener" tab is selected.</li>
                            <li>Paste your long URL into the input field labeled "URL to shorten".</li>
                            <li>Click the "Shorten URL" button.</li>
                            <li>Your new, short link will appear below the button. You can click the copy icon to copy it to your clipboard.</li>
                        </ol>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center"><QrCode className="mr-2 text-primary" /> Generating a QR Code</h3>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Navigate to the homepage.</li>
                            <li>Select the "QR Code" tab.</li>
                            <li>Enter any URL or text into the input field.</li>
                            <li>Click the "Generate QR Code" button.</li>
                            <li>A preview of your QR code will appear. Click the "Download QR Code" button to save it as a PNG image.</li>
                        </ol>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center">Managing Your Links (Registered Users)</h3>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Sign in to your account.</li>
                            <li>Navigate to the "Dashboard".</li>
                            <li>Click on the "Links" tab in the sidebar to see all your links.</li>
                            <li>Use the action menu (three dots) on each link to copy, edit, or delete it.</li>
                            <li>Click on the "Analytics" tab to view detailed statistics for all your links.</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="report" className="pt-8">
             <Card>
                <CardHeader>
                    <CardTitle>Report Abuse</CardTitle>
                    <CardContent className="pt-6 px-0 space-y-4">
                        <p className="text-muted-foreground">
                            If you've found a MiniFyn link that violates our <Link href="/acceptable-use" className="underline">Acceptable Use Policy</Link> (e.g., links to spam, phishing, or illegal content), please let us know.
                        </p>
                         <p className="text-muted-foreground">
                            Please provide the abusive MiniFyn URL and a brief description of the issue on our contact page. Our team will review the report and take appropriate action.
                        </p>
                        <Button asChild>
                           <Link href="/contact">Go to Contact Page <ArrowRight className="ml-2"/></Link>
                        </Button>
                    </CardContent>
                </CardHeader>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
