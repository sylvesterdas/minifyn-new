
import { Code, Wand2, ArrowRight, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UrlShortenerCard } from '@/components/url-shortener-card';
import type { WithContext, ItemList } from 'schema-dts';



export const metadata: Metadata = {
  title: 'Developer Tools | MiniFyn',
  description: 'A collection of free, fast, and secure developer tools that run entirely in your browser. Minify code, format JSON, debug JWTs, and more.',
  alternates: {
    canonical: 'https://www.minifyn.com/tools',
  },
};

const toolSections = [
    {
        href: '/tools/code-minifier',
        icon: <Code className="h-8 w-8 text-primary" />,
        title: 'Code Minifier',
        description: 'Minify JS, CSS, HTML, and JSON files to reduce size.'
    },
    {
        href: '/tools/json-formatter',
        icon: <Wand2 className="h-8 w-8 text-primary" />,
        title: 'JSON Formatter',
        description: 'Format, prettify, and validate your JSON data instantly.'
    },
    {
        href: '/tools/jwt-debugger',
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: 'JWT Debugger',
        description: 'Decode and inspect JSON Web Tokens safely in your browser.'
    },
];

export default function ToolsPage() {
  const siteUrl = 'https://www.minifyn.com';

  const jsonLd: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MiniFyn Developer Tools',
    description: 'A collection of free, fast, and secure developer tools that run entirely in your browser.',
    itemListElement: toolSections.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: tool.title,
        description: tool.description,
        url: `${siteUrl}${tool.href}`,
        provider: {
          '@type': 'Organization',
          name: 'MiniFyn'
        }
      }
    })),
  };

  return (
    <>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Developer Tools</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            A collection of free, fast, and secure tools that run entirely in your browser. No data is ever sent to our servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="md:col-span-2">
                <UrlShortenerCard />
            </div>
            {toolSections.map((section) => (
                <Link href={section.href} key={section.title}>
                    <Card className="h-full hover:border-primary transition-colors group">
                        <CardHeader className="flex flex-row items-start gap-4 p-6">
                            {section.icon}
                            <div className="flex-1">
                                <CardTitle className="text-xl">{section.title}</CardTitle>
                                <CardDescription className="mt-2">{section.description}</CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
    </>
  );
}
