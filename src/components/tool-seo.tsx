import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ToolSeo({ title, description, cta, href }: { title: string; description: string; cta: string; href: string }) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, description, applicationCategory: 'DeveloperApplication', operatingSystem: 'Any', url: `https://www.minifyn.com${href}`, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, provider: { '@type': 'Organization', name: 'MiniFyn', url: 'https://www.minifyn.com' } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Card className="mt-10 border-primary/20 bg-primary/5"><CardHeader><CardTitle>{cta}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{description}</p><Link className="mt-4 inline-block font-semibold text-primary hover:underline" href={href}>Learn more →</Link></CardContent></Card></>;
}
