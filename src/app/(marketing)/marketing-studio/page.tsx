import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, KeyRound, ShieldCheck, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketing Studio | MiniFyn',
  description: 'An invite-only workspace for planning, reviewing, measuring, and scheduling marketing across multiple apps.',
  alternates: { canonical: 'https://www.minifyn.com/marketing-studio' },
};

const capabilities = [
  { icon: BarChart3, title: 'App-aware analytics', text: 'Connect permitted analytics and store accounts, then view cached app-specific performance summaries.' },
  { icon: Users, title: 'Workspace collaboration', text: 'Share selected apps with owners, managers, editors, reviewers, and viewers.' },
  { icon: ShieldCheck, title: 'Human approval gates', text: 'Review generated content and media before scheduling or publishing consequential work.' },
  { icon: KeyRound, title: 'Controlled connections', text: 'Use OAuth where providers support it and encrypted, write-only credentials where they do not.' },
];

export default function MarketingStudioPage() {
  return <div className="flex-1 bg-background">
    <section className="border-b bg-card/40 py-20 md:py-28"><div className="container mx-auto max-w-5xl px-4 text-center">
      <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"><ShieldCheck className="h-4 w-4"/> Invite-only beta</div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Marketing Studio</h1>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">A MiniFyn workspace for organizing app marketing, analytics, review, media preparation, and scheduling without sharing provider passwords or bypassing human approval.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4"><a className="inline-flex items-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground" href="https://social.minifyn.com/beta/">Open invited beta <ArrowRight className="ml-2 h-4 w-4"/></a><Link className="inline-flex items-center rounded-md border px-5 py-3 font-semibold" href="/contact">Request information</Link></div>
    </div></section>
    <section className="container mx-auto max-w-6xl px-4 py-16"><div className="grid gap-6 md:grid-cols-2">{capabilities.map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border bg-card p-6"><Icon className="h-7 w-7 text-primary"/><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 text-muted-foreground">{text}</p></article>)}</div>
      <div className="mt-12 rounded-2xl border p-6"><h2 className="text-2xl font-semibold">Provider access</h2><p className="mt-3 text-muted-foreground">When you connect Google, Marketing Studio requests only the scopes needed for enabled features. Access remains limited by your existing Google Analytics, Google Play Console, and Cloud Storage permissions. You can revoke access from your provider account or disconnect it from the workspace.</p><div className="mt-4 flex gap-4 text-sm"><Link className="underline" href="/marketing-studio/privacy">Privacy Policy</Link><Link className="underline" href="/marketing-studio/terms">Terms of Service</Link></div></div>
    </section>
  </div>;
}
