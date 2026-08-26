import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export interface AppMetadata {
  name: string;
  tagline: string;
  description: string;
  packageId: string;
  webUrl: string;
  playstoreURL: string | null;
  appstoreURL: string | null;
  logoUrl: string;
  published: boolean;
}

const APPS: AppMetadata[] = [
  {
    name: "ScamGuard: Link Checker",
    tagline: "Link & QR Threat Checker",
    description: "Inspect suspicious links, QR codes, and redirect chains before opening them to safeguard against phishing and malicious links.",
    packageId: "com.minifyn.linkguard",
    webUrl: "https://www.minifyn.com/scamguard",
    playstoreURL: "https://play.google.com/store/apps/details?id=com.minifyn.linkguard",
    appstoreURL: null,
    logoUrl: "https://www.minifyn.com/images/scamguard-logo.png",
    published: true,
  },
  {
    name: "MiniFyn: URL Shortener & Hub",
    tagline: "Edge URL Shortener & Dev Tools",
    description: "Lightning-fast edge link shortening, custom bio-links, QR code generator, and link analytics with built-in Web Risk threat protection.",
    packageId: "com.minifyn.web",
    webUrl: "https://www.minifyn.com",
    playstoreURL: null,
    appstoreURL: null,
    logoUrl: "https://www.minifyn.com/images/minifyn-logo.png",
    published: true,
  },
  {
    name: "CensorFyn: Offline Media Redact",
    tagline: "100% Offline Media Redaction",
    description: "Auto-detect and irreversibly redact faces, passports, credit cards, PII text, and QR codes with true pixel destruction.",
    packageId: "com.minifyn.censorfyn",
    webUrl: "https://www.minifyn.com/censorfyn",
    playstoreURL: "https://play.google.com/store/apps/details?id=com.minifyn.censorfyn",
    appstoreURL: null,
    logoUrl: "https://www.minifyn.com/images/censorfyn/logo_transparent.png",
    published: false,
  },
  {
    name: "ClipFyn: Video Preparation",
    tagline: "On-Device Video Preparation",
    description: "Inspect, crop, fit, and prepare videos locally on Android for broadly compatible sharing without quality degradation or server uploads.",
    packageId: "com.minifyn.clipfyn",
    webUrl: "https://www.minifyn.com/clipfyn",
    playstoreURL: "https://play.google.com/store/apps/details?id=com.minifyn.clipfyn",
    appstoreURL: null,
    logoUrl: "https://www.minifyn.com/images/clipfyn/logo.png",
    published: false,
  },
  {
    name: "Marketing Studio",
    tagline: "Autonomous Marketing Operations",
    description: "Multi-tenant autonomous marketing and content operations cockpit for solo developers, founders, and indie hacker product studios.",
    packageId: "com.minifyn.studio",
    webUrl: "https://www.minifyn.com",
    playstoreURL: null,
    appstoreURL: null,
    logoUrl: "https://www.minifyn.com/images/studio-logo.png",
    published: false,
  },
];

const APPS_JSON = JSON.stringify(APPS);
const APPS_ETAG = `"${crypto.createHash('md5').update(APPS_JSON).digest('hex')}"`;

export async function GET(request: NextRequest) {
  const clientEtag = request.headers.get('if-none-match');

  const headers = {
    'ETag': APPS_ETAG,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    'Vary': 'Accept-Encoding, If-None-Match',
  };

  if (clientEtag && clientEtag === APPS_ETAG) {
    return new NextResponse(null, {
      status: 304,
      headers,
    });
  }

  return NextResponse.json(APPS, {
    headers,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
    },
  });
}
