import { getLinkBySlug } from '@/lib/data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Redirector } from '@/components/redirector';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const link = await getLinkBySlug(params.slug);
    
    if (!link) {
        return {
            title: 'Not Found | MiniFyn',
            description: 'This link could not be found or has expired.',
        };
    }
    
    const title = link.title || 'Redirecting...';
    const description = link.description || 'You are being redirected to your destination.';
    const images = [link.ogImage, link.twitterImage].filter(Boolean) as string[];

    return {
        title: `${title} | MiniFyn`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: link.longUrl,
            images: images.length > 0 ? images : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: images.length > 0 ? images : undefined,
        }
    };
}


export default async function SlugPage({ params }: Props) {
    const link = await getLinkBySlug(params.slug);

    if (!link) {
        notFound();
    }
    
    return <Redirector longUrl={link.longUrl} />;
}
