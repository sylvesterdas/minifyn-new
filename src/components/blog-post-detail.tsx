import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { HashnodePost } from '@/lib/hashnode';

interface BlogPostDetailProps {
    post: HashnodePost;
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
    const authorName = post.author?.name || 'Sylvester Das';

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
                
                <div dangerouslySetInnerHTML={{ __html: post.content.html }}></div>
            </div>
        </article>
    );
}
