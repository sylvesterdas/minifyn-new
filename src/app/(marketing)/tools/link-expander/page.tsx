import type { Metadata } from 'next';
import { LinkExpander } from '@/components/link-expander';
import { Disclaimer } from '@/components/disclaimer';
import { RelatedTools } from '@/components/related-tools';
import { ToolSeo } from '@/components/tool-seo';
export const metadata: Metadata = { title: 'Link Expander & Hop Tracer | MiniFyn', description: 'Safely expand shortened URLs and inspect redirect chains.', alternates: { canonical: 'https://www.minifyn.com/tools/link-expander' } };
export default function LinkExpanderPage() { return <><div className="container mx-auto max-w-4xl px-4 py-12 md:py-24"><div className="mb-10 text-center"><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Link Expander</h1><p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">See where a shortened URL goes and inspect every redirect hop before visiting it.</p></div><LinkExpander /><ToolSeo title="Link Expander" description="If a link looks suspicious, ScamGuard can review URLs, QR links, and browser handoffs before you open them." cta="Get deeper link safety checks with ScamGuard" href="/scamguard" /></div><div className="container mx-auto px-4"><Disclaimer /></div><div className="py-12 md:py-16"><div className="container mx-auto max-w-4xl px-4"><RelatedTools /></div></div></>; }
