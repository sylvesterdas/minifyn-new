
'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { HashnodePost } from '@/lib/hashnode';
import { loadMorePosts } from '@/app/(marketing)/blog/actions';
import { Loader2, Clock, X, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedTag, setSelectedTag] = useState<string | null>(searchParams.get('tag'));
    
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearchTerm) {
            params.set('search', debouncedSearchTerm);
        } else {
            params.delete('search');
        }
        if (selectedTag) {
            params.set('tag', selectedTag);
        } else {
            params.delete('tag');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [debouncedSearchTerm, selectedTag, pathname, router, searchParams]);
    

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
                const search = debouncedSearchTerm.toLowerCase();
                if (!search) return true;
                const titleMatch = post.title.toLowerCase().includes(search);
                const briefMatch = post.brief.toLowerCase().includes(search);
                return titleMatch || briefMatch;
            });
    }, [posts, debouncedSearchTerm, selectedTag]);

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
    
    const handleTagClick = (tagName: string) => {
        setSelectedTag(currentTag => (currentTag === tagName ? null : tagName));
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
                    aria-label="Search posts"
                />
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {allTags.map(tag => (
                        <Badge
                            key={tag}
                            variant={selectedTag === tag ? 'default' : 'secondary'}
                            onClick={() => handleTagClick(tag)}
                            className="cursor-pointer transition-all"
                            role="button"
                            aria-pressed={selectedTag === tag}
                            tabIndex={0}
                        >
                            {tag}
                            {selectedTag === tag && <X className="ml-1.5 h-3 w-3" />}
                        </Badge>
                    ))}
                </div>
            </div>

            {filteredPosts.length > 0 ? (
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post, index) => {
                        const authorName = post.author?.name || "Sylvester Das";
                        const authorImage = post.author?.profilePicture;
                        return (
                        <Card key={post.slug} className="flex flex-col group overflow-hidden rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-300">
                             <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                                <div className="aspect-[1.91/1] relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={post.coverImage?.url || 'https://placehold.co/600x400.png'}
                                        alt={post.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        loading={index < 3 ? 'eager' : 'lazy'}
                                        data-ai-hint="blog post"
                                    />
                                </div>
                            </Link>
                            <CardContent className="p-6 flex flex-col flex-grow">
                                {post.tags && post.tags.length > 0 && (
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        {post.tags.slice(0, 2).map(tag => (
                                            <Badge key={tag.slug} variant="secondary" className="text-xs">{tag.name}</Badge>
                                        ))}
                                    </div>
                                )}
                                <h2 className="text-xl font-bold mb-3 flex-grow">
                                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                                </h2>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                    {post.brief}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-border/50">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={authorImage} alt={authorName} />
                                                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{authorName}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" />
                                            <span>{post.readTimeInMinutes} min read</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )})}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg font-semibold">No posts found</p>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                </div>
            )}

            {pageInfo.hasNextPage && !debouncedSearchTerm && !selectedTag && (
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
