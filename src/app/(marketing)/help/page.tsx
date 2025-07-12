import { FileQuestion, LifeBuoy, ShieldAlert, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center | MiniFyn',
  description: 'Find answers, guides, and support for MiniFyn.',
};

const helpSections = [
    {
        href: '/help/faq',
        icon: <FileQuestion className="h-8 w-8 text-primary" />,
        title: 'FAQ',
        description: 'Find answers to common questions about MiniFyn.'
    },
    {
        href: '/help/guides',
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        title: 'Guides',
        description: 'Step-by-step tutorials on how to use our features.'
    },
    {
        href: '/help/report-abuse',
        icon: <ShieldAlert className="h-8 w-8 text-primary" />,
        title: 'Report Abuse',
        description: 'Learn how to report malicious or inappropriate links.'
    },
    {
        href: '/contact',
        icon: <LifeBuoy className="h-8 w-8 text-primary" />,
        title: 'Contact Support',
        description: 'Can\'t find what you\'re looking for? Contact us directly.'
    }
]

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Help Center</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          How can we help you today?
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {helpSections.map((section) => (
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
    </div>
  );
}
