
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ArrowRight, Code, Wand2, Link as LinkIcon, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { UrlShortenerCard } from './url-shortener-card';

interface ToolInfo {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const allTools: ToolInfo[] = [
    {
        href: '/tools/code-minifier',
        icon: <Code className="h-8 w-8 text-primary" />,
        title: 'Code Minifier',
        description: 'Minify JS, CSS, HTML, and JSON to reduce file size.',
    },
    {
        href: '/tools/json-formatter',
        icon: <Wand2 className="h-8 w-8 text-primary" />,
        title: 'JSON Formatter',
        description: 'Format, prettify, and validate your JSON data instantly.',
    },
    {
        href: '/tools/jwt-debugger',
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: 'JWT Debugger',
        description: 'Decode and inspect JSON Web Tokens safely in your browser.'
    },
];

export function RelatedTools() {
    const currentPath = usePathname();
    const otherTools = allTools.filter(tool => tool.href !== currentPath);

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight">Explore Our Tools</h2>
                <p className="mt-2 text-muted-foreground">Boost your productivity with our suite of free utilities.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-1">
                {/* Always show the main URL shortener tool */}
                <UrlShortenerCard />

                {/* Show other available tools */}
                {otherTools.map((tool) => (
                    <Link href={tool.href} key={tool.title}>
                        <Card className="h-full hover:border-primary transition-colors group">
                            <CardHeader className="flex flex-row items-start gap-4">
                                {tool.icon}
                                <div className="flex-1">
                                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                                    <CardDescription className="mt-2">{tool.description}</CardDescription>
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
