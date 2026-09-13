import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { EXTENSIONS } from '@/lib/extensions';

export const dynamic = 'force-dynamic';
export { EXTENSIONS } from '@/lib/extensions';
export type { ExtensionMetadata, ExtensionStatus } from '@/lib/extensions';

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
