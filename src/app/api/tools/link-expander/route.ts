import { NextResponse } from 'next/server';
import { expandLink } from '@/lib/link-expander';
import { clientKey, logEvent, rateLimit, requestId, withRequestHeaders } from '@/lib/observability';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  const id = requestId(request); const limit = rateLimit(`link-expander:${clientKey(request)}`, 30, 60_000);
  if (!limit.allowed) return withRequestHeaders(NextResponse.json({ error: 'Too many requests. Try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }), id);
  try { const body = await request.json(); if (typeof body?.url !== 'string' || body.url.length > 2048) return withRequestHeaders(NextResponse.json({ error: 'Enter a valid URL.' }, { status: 400 }), id); return withRequestHeaders(NextResponse.json(await expandLink(body.url)), id); }
  catch (error) { logEvent('link_expander_error', { requestId: id, reason: error instanceof Error ? error.message : 'unknown' }); return withRequestHeaders(NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to trace this URL.' }, { status: 400 }), id); }
}
