import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export type ExtensionStatus = 'in_development' | 'submitted' | 'published';

export interface ExtensionMetadata {
  id: string;
  name: string;
  description: string;
  browser: 'chrome';
  version: string | null;
  status: ExtensionStatus;
  published: boolean;
  logoUrl: string;
  websiteUrl: string;
  storeUrl: string | null;
}

export const EXTENSIONS: ExtensionMetadata[] = [
  {
    id: 'scamguard-link-checker',
    name: 'ScamGuard: Link Checker',
    description: 'Check visible link warning signs locally before opening a site.',
    browser: 'chrome',
    version: null,
    status: 'in_development',
    published: false,
    logoUrl: 'https://www.minifyn.com/images/scamguard-logo.png',
    websiteUrl: 'https://www.minifyn.com/scamguard',
    storeUrl: null,
  },
  {
    id: 'minifyn-url-shortener',
    name: 'MiniFyn: URL Shortener',
    description: 'Create and manage MiniFyn short links from Chrome.',
    browser: 'chrome',
    version: null,
    status: 'in_development',
    published: false,
    logoUrl: 'https://www.minifyn.com/images/minifyn-logo.png',
    websiteUrl: 'https://www.minifyn.com',
    storeUrl: null,
  },
];

const payload = JSON.stringify(EXTENSIONS);
const etag = `"${crypto.createHash('md5').update(payload).digest('hex')}"`;
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, If-None-Match',
};

export async function GET(request: NextRequest) {
  const headers = {
    ...corsHeaders,
    ETag: etag,
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    Vary: 'Accept-Encoding, If-None-Match',
  };
  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304, headers });
  }
  return NextResponse.json(EXTENSIONS, { headers });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
