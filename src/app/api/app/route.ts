import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour

export interface AppMetadata {
  name: string;
  packageId: string;
  webUrl: string;
  playstoreURL: string | null;
  appstoreURL: string | null;
}

const APPS: AppMetadata[] = [
  {
    name: "ScamGuard: URL Checker",
    packageId: "com.minifyn.linkguard",
    webUrl: "https://www.minifyn.com/scamguard",
    playstoreURL: "https://play.google.com/store/apps/details?id=com.minifyn.linkguard",
    appstoreURL: null,
  },
  {
    name: "CensorFyn: Offline Media Redact",
    packageId: "com.minifyn.censorfyn",
    webUrl: "https://www.minifyn.com/censorfyn",
    playstoreURL: "https://play.google.com/store/apps/details?id=com.minifyn.censorfyn",
    appstoreURL: null,
  },
  {
    name: "ClipFyn: Video Preparation",
    packageId: "com.minifyn.clipfyn",
    webUrl: "https://www.minifyn.com/clipfyn",
    playstoreURL: "https://play.google.com/store/apps/details?id=com.minifyn.clipfyn",
    appstoreURL: null,
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
