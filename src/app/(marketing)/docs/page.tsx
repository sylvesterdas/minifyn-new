import { Key, BookOpen, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Documentation | MiniFyn',
  description: 'Explore our guides and API documentation to get the most out of MiniFyn.',
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
    </div>
  );
}
