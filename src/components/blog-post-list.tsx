
'use client';

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HashnodePost } from '@/lib/hashnode';
import { loadMorePosts } from '@/app/(marketing)/blog/actions';
import { Loader2, Clock, Tag, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        posts.forEach(post => {
            post.tags?.forEach(tag => tags.add(tag.name));
        });
        return Array.from(tags).sort();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts
            .filter(post => {
                if (!selectedTag) return true;
                return post.tags?.some(tag => tag.name === selectedTag);
            })
            .filter(post => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                const titleMatch = post.title.toLowerCase().includes(searchLower);
                const briefMatch = post.brief.toLowerCase().includes(searchLower);
                return titleMatch || briefMatch;
            });
    }, [posts, searchTerm, selectedTag]);

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
            <div className="mb-12 space-y-6">
                <Input
                    type="text"
                    placeholder="Search posts..."
                    className="max-w-lg mx-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {allTags.map(tag => (
                        <Badge
                            key={tag}
                            variant={selectedTag === tag ? 'default' : 'secondary'}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className="cursor-pointer transition-all"
                        >
                            {tag}
                            {selectedTag === tag && <X className="ml-1.5 h-3 w-3" />}
                        </Badge>
                    ))}
                </div>
            </div>

            {filteredPosts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => {
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
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg font-semibold">No posts found</p>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                </div>
            )}

            {pageInfo.hasNextPage && !searchTerm && !selectedTag && (
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
