
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { HashnodePost } from '@/lib/hashnode';
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import { SocialShare } from './social-share';
import { CtaCard } from './cta-card';
import { SocialLinks } from './social-links';
import { getOrCreateShortUrlForPost } from '@/app/(marketing)/blog/actions';

// Register languages we expect to use
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

interface BlogPostDetailProps {
    post: HashnodePost;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
    const authorName = post.author?.name || 'Sylvester Das';
    const contentRef = useRef<HTMLDivElement>(null);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.minifyn.com';
    const longPostUrl = `${siteUrl}/blog/${post.slug}`;
    const [shareUrl, setShareUrl] = useState(longPostUrl);

    useEffect(() => {
        // Fetch the short URL for sharing
        getOrCreateShortUrlForPost(longPostUrl).then(url => {
            if (url) setShareUrl(url);
        });

        if (contentRef.current) {
            // Find all <pre><code> blocks and apply highlighting
            contentRef.current.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
        }
    }, [post.content.html, longPostUrl]);

    return (
        <article className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
            </header>

            {post.coverImage?.url && (
                <div className="relative aspect-[16/9] mb-8">
                    <Image
                        src={post.coverImage.url}
                        alt={post.title}
                        fill
                        className="rounded-lg object-cover"
                        priority
                    />
                </div>
            )}
            
             <div className="prose prose-invert mx-auto prose-lg">
                <header className="mb-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                        <p>By {authorName}</p>
                        <span>&bull;</span>
                        <p>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</p>
                        <span>&bull;</span>
                        <p className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {post.readTimeInMinutes} min read
                        </p>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <Link key={tag.slug} href={`/blog?tag=${encodeURIComponent(tag.name)}`}>
                                    <Badge 
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-primary/20"
                                    >
                                        {tag.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}
                </header>
                
                <div ref={contentRef} dangerouslySetInnerHTML={{ __html: post.content.html }}></div>
            </div>

            <div className="max-w-2xl mx-auto mt-12">
                <hr className="border-border my-8" />
                <SocialShare url={shareUrl} title={post.title} />
                <hr className="border-border my-8" />
                <CtaCard />
                <hr className="border-border my-8" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Follow Us for Updates</h3>
                    <SocialLinks />
                </div>
            </div>
        </article>
    );
}
