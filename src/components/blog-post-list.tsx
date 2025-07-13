
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HashnodePost } from '@/lib/hashnode';
import { loadMorePosts } from '@/app/(marketing)/blog/actions';
import { Loader2 } from 'lucide-react';

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
                // Optionally handle error state, e.g., show a toast message
                console.error(result.error);
            }
        });
    };

    return (
        <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card key={post.slug} className="flex flex-col">
                        <CardHeader>
                            {post.coverImage?.url && (
                                <Link href={`/blog/${post.slug}`} className="aspect-[16/9] relative block">
                                    <Image
                                        src={post.coverImage.url}
                                        alt={post.title}
                                        fill
                                        className="rounded-t-lg object-cover"
                                    />
                                </Link>
                            )}
                            <CardTitle className="pt-4">
                               <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </CardTitle>
                            <CardDescription>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{post.brief}</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="secondary">
                                <Link href={`/blog/${post.slug}`}>Read More</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
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
