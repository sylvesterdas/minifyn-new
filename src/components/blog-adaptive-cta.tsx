'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Smartphone, ArrowRight, Search, Sparkles, Scissors, EyeOff, CheckCircle2 } from 'lucide-react';

interface BlogAdaptiveCtaProps {
  tags?: string[];
  variant?: 'in-article' | 'bottom';
}

type AppTarget = {
  name: string;
  tagline: string;
  description: string;
  badge: string;
  playUrl: string;
  internalUrl: string;
  icon: typeof Shield;
};

const APPS: Record<string, AppTarget> = {
  scamguard: {
    name: 'ScamGuard',
    tagline: 'AI-Powered Link Safety & Phishing Shield',
    description: 'Protect your Android device from malicious URLs, phishing traps, and zero-day scams in real-time.',
    badge: 'Security & Antivirus',
    playUrl: '/go/scamguard-play',
    internalUrl: '/scamguard',
    icon: Shield,
  },
  clipfyn: {
    name: 'ClipFyn',
    tagline: '9:16 Video Reformatting & Blur Letterboxing',
    description: 'Transform landscape videos for Instagram Reels, YouTube Shorts, and TikTok with GPU hardware acceleration.',
    badge: 'Video Tools',
    playUrl: '/clipfyn',
    internalUrl: '/clipfyn',
    icon: Scissors,
  },
  censorfyn: {
    name: 'CensorFyn',
    tagline: '100% On-Device PII & Image Redaction',
    description: 'Auto-redact faces, sensitive documents, QR codes, and PII without uploading anything to the cloud.',
    badge: 'Privacy & Security',
    playUrl: '/censorfyn',
    internalUrl: '/censorfyn',
    icon: EyeOff,
  },
};

function resolveAppByTags(tags: string[] = []): AppTarget {
  const normalized = tags.map((t) => t.toLowerCase());

  if (normalized.some((t) => ['video', 'reels', 'shorts', 'media', 'crop', 'aspect-ratio'].includes(t))) {
    return APPS.clipfyn;
  }
  if (normalized.some((t) => ['privacy', 'redact', 'censor', 'pii', 'exif', 'metadata'].includes(t))) {
    return APPS.censorfyn;
  }
  return APPS.scamguard;
}

export function BlogAdaptiveCta({ tags = [], variant = 'bottom' }: BlogAdaptiveCtaProps) {
  const [isAndroid, setIsAndroid] = useState<boolean | null>(null);
  const [scanUrl, setScanUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent || '';
    setIsAndroid(/android/i.test(userAgent));
  }, []);

  const app = resolveAppByTags(tags);
  const IconComponent = app.icon;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanUrl.trim()) return;
    const cleanUrl = scanUrl.trim();
    router.push(`/tools/link-expander?url=${encodeURIComponent(cleanUrl)}`);
  };

  if (isAndroid === null) {
    return (
      <div className={`rounded-2xl border bg-muted/20 animate-pulse ${variant === 'in-article' ? 'my-8 p-6' : 'my-12 p-8'}`}>
        <div className="h-6 w-1/3 bg-muted rounded mb-3" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>
    );
  }

  if (variant === 'in-article') {
    if (isAndroid) {
      return (
        <aside className="my-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-background p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Recommended Android App
                  </span>
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {app.name}: {app.tagline}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                  {app.description}
                </p>
              </div>
            </div>
            <Link
              href={app.playUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shrink-0 shadow-sm"
            >
              <Smartphone className="h-4 w-4" />
              Get on Google Play
            </Link>
          </div>
        </aside>
      );
    }

    return (
      <aside className="my-8 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-background p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  Free Security Utility
                </span>
              </div>
              <h4 className="text-base font-bold text-foreground">
                Universal Link Expander & Safety Scanner
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Paste any shortened or suspicious URL to safely unmask redirect chains and verify Web Risk security ratings.
              </p>
            </div>
          </div>

          <form onSubmit={handleScanSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://mnfy.in/xyz or any short link..."
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/80 px-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
            >
              <Search className="h-3.5 w-3.5" />
              Scan Link
            </button>
          </form>
        </div>
      </aside>
    );
  }

  if (isAndroid) {
    return (
      <div className="my-14 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Smartphone className="h-3.5 w-3.5" /> Android App Suite
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Install {app.name} for Android
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {app.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Verified on Google Play
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 100% Privacy Focused
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              href={app.playUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              <Smartphone className="h-4 w-4" />
              Get on Google Play
            </Link>
            <Link
              href={app.internalUrl}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border bg-background/80 px-5 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-all"
            >
              Learn More <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-14 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> MiniFyn Security & URL Tools
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Check Any Link with Universal URL Expander
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Trace shortened redirect hops in ~15ms without executing client-side scripts. Uncover final destinations and phishing threats safely.
          </p>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-3">
          <form onSubmit={handleScanSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Paste any link to inspect..."
              value={scanUrl}
              onChange={(e) => setScanUrl(e.target.value)}
              className="w-full rounded-xl border border-input bg-background/90 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              <Search className="h-4 w-4" /> Scan URL Free
            </button>
          </form>
          <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
            <Link href="/tools/link-expander" className="hover:text-primary transition-colors">
              Open Link Expander Tool →
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Shorten a Link →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
