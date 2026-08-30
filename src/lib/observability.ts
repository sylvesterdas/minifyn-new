import crypto from 'node:crypto';

export function requestId(request: Request): string {
  return request.headers.get('x-request-id')?.slice(0, 100) || crypto.randomUUID();
}

export function logEvent(event: string, fields: Record<string, unknown> = {}): void {
  // Keep logs machine-readable and never log raw URLs, tokens, or request bodies.
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...fields }));
}

export function withRequestHeaders(response: Response, id: string): Response {
  response.headers.set('x-request-id', id);
  return response;
}

type RateEntry = { count: number; resetAt: number };
const globalState = globalThis as typeof globalThis & { __publicRateLimits__?: Map<string, RateEntry> };
const limits = globalState.__publicRateLimits__ || (globalState.__publicRateLimits__ = new Map());

export function rateLimit(key: string, max: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const current = limits.get(key);
  if (!current || current.resetAt <= now) { limits.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, retryAfter: 0 }; }
  current.count += 1;
  return { allowed: current.count <= max, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

export function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}
