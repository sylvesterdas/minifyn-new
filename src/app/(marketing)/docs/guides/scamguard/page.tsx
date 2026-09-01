import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'ScamGuard Help | MiniFyn', description: 'Learn how to check links and understand ScamGuard results.' };

export default function ScamGuardGuide() { return <Guide title="ScamGuard" intro="Check links before opening them and use the result as one safety signal—not a guarantee." sections={[
  ['Check a link', ['Open ScamGuard and paste the URL or message into the scanner.', 'If several links are found, select the link you want to inspect.', 'Review the result before opening the destination.']],
  ['Understand results', ['No obvious risk means no obvious risk signals were found.', 'Suspicious means verify the sender and destination using a trusted channel.', 'High risk means do not proceed unless you independently confirm the request.']],
  ['QR scanning and privacy', ['Scan only QR codes from places you trust.', 'Check the detected URL before opening it.', 'Never share passwords, OTPs, or private account data with support.']],
]} /> }

function Guide({ title, intro, sections }: { title: string; intro: string; sections: [string, string[]][] }) { return <main className="container mx-auto max-w-3xl px-4 py-12"><Link href="/docs/guides" className="text-sm text-primary underline">All guides</Link><h1 className="mt-6 text-4xl font-bold">{title} help</h1><p className="mt-3 text-lg text-muted-foreground">{intro}</p><div className="mt-10 space-y-8">{sections.map(([heading, items]) => <section key={heading}><h2 className="text-2xl font-semibold">{heading}</h2><ol className="mt-3 list-decimal space-y-2 pl-6 text-muted-foreground">{items.map(item => <li key={item}>{item}</li>)}</ol></section>)}</div><p className="mt-12 border-t pt-6 text-sm text-muted-foreground">Need help with a problem? <Link href="/contact" className="text-primary underline">Contact support</Link> without sending passwords or one-time codes.</p></main> }
