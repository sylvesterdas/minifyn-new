import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour

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
];

export async function GET() {
  return NextResponse.json(APPS, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
