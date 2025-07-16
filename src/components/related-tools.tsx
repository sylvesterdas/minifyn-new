
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ArrowRight, Code, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolInfo {
    href: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    relatedTo?: string[];
}

const allTools: ToolInfo[] = [
    {
        href: '/tools/code-minifier',
        icon: <Code className="h-8 w-8 text-primary" />,
        title: 'Code Minifier',
        description: 'Minify JS, CSS, HTML, and JSON to reduce file size.',
        relatedTo: ['/tools/json-formatter'],
    },
    {
        href: '/tools/json-formatter',
        icon: <Wand2 className="h-8 w-8 text-primary" />,
        title: 'JSON Formatter',
        description: 'Format, prettify, and validate your JSON data instantly.',
        relatedTo: ['/tools/code-minifier'],
    },
];

interface RelatedToolsProps {
    currentTool: string;
}

export function RelatedTools({ currentTool }: RelatedToolsProps) {
    const currentToolInfo = allTools.find(tool => tool.href === currentTool);
    const relatedToolHref = currentToolInfo?.relatedTo?.[0];
    const prominentTool = allTools.find(tool => tool.href === relatedToolHref);

    // Filter out the current tool and the prominent one for the "other tools" list
    const otherTools = allTools.filter(tool => tool.href !== currentTool && tool.href !== relatedToolHref);

    return (
        <div className="py-12 bg-muted/20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tight">Explore Other Tools</h2>
                    <p className="mt-2 text-muted-foreground">Boost your productivity with our suite of free developer tools.</p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Prominent Related Tool */}
                    {prominentTool && (
                        <Link href={prominentTool.href} className="md:col-span-2">
                            <Card className="h-full hover:border-primary transition-colors group bg-card/50 border-primary/20 shadow-lg">
                                <CardHeader className="flex flex-row items-start gap-4 p-6">
                                    {prominentTool.icon}
                                    <div className="flex-1">
                                        <CardTitle className="text-xl flex items-center">{prominentTool.title} <span className="text-sm font-normal text-primary ml-2">(Related)</span></CardTitle>
                                        <CardDescription className="mt-2">{prominentTool.description}</CardDescription>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </CardHeader>
                            </Card>
                        </Link>
                    )}

                    {/* Other Tools */}
                    {otherTools.map((tool) => (
                        <Link href={tool.href} key={tool.title} className={cn(!prominentTool && 'md:col-span-1')}>
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
        </div>
    );
}
