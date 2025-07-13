
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HashnodePost } from '@/lib/hashnode';
import { loadMorePosts } from '@/app/(marketing)/blog/actions';
import { Loader2, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Post = Omit<HashnodePost, 'content' | 'ogImage'>;

interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

interface BlogPostListProps {
    initialPosts: Post[];
    initialPageInfo: PageInfo;
}

export function BlogPostList({ initialPosts, initialPageInfo }: BlogPostListProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
    const [isPending, startTransition] = useTransition();

    const handleLoadMore = () => {
        if (!pageInfo.endCursor) return;

        startTransition(async () => {
            const result = await loadMorePosts(pageInfo.endCursor!);
            if (result && !result.error) {
                setPosts(prev => [...prev, ...result.posts]);
                setPageInfo(result.pageInfo);
            } else {
                console.error(result.error);
            }
        });
    };

    return (
        <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                    const authorName = post.author?.name || "Sylvester Das";
                    return (
                    <Card key={post.slug} className="flex flex-col">
                        <CardHeader>
                            {post.coverImage?.url && (
                                <Link href={`/blog/${post.slug}`} className="aspect-[16/9] relative block mb-4">
                                    <Image
                                        src={post.coverImage.url}
                                        alt={post.title}
                                        fill
                                        className="rounded-t-lg object-cover"
                                    />
                                </Link>
                            )}
                            <CardTitle>
                               <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </CardTitle>
                             <CardDescription className="flex flex-wrap items-center gap-x-2 text-xs">
                                <span>By {authorName}</span>
                                <span className="text-muted-foreground/50">&bull;</span>
                                <span>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                                <span className="text-muted-foreground/50">&bull;</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {post.readTimeInMinutes} min read
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{post.brief}</p>
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="secondary">
                                <Link href={`/blog/${post.slug}`}>Read More</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )})}
            </div>

            {pageInfo.hasNextPage && (
                <div className="mt-12 text-center">
                    <Button onClick={handleLoadMore} disabled={isPending} size="lg">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </div>
            )}
        </>
    );
}
