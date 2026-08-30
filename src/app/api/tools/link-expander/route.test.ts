import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@/lib/link-expander', () => ({
  expandLink: vi.fn(async (url: string) => ({ finalUrl: 'https://example.com/final', hops: [{ url, status: 302, location: 'https://example.com/final' }], truncated: false })),
}));

describe('link expander API', () => {
  beforeEach(() => { vi.resetModules(); delete (globalThis as { __publicRateLimits__?: unknown }).__publicRateLimits__; });

  test('returns a traced chain and request id', async () => {
    const { POST } = await import('./route');
    const response = await POST(new NextRequest('https://www.minifyn.com/api/tools/link-expander', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': 'test-client' }, body: JSON.stringify({ url: 'https://short.example/a' }) }));
    expect(response.status).toBe(200);
    expect(response.headers.get('x-request-id')).toBeTruthy();
    expect((await response.json()).finalUrl).toBe('https://example.com/final');
  });

  test('rejects malformed and oversized input', async () => {
    const { POST } = await import('./route');
    const response = await POST(new Request('https://www.minifyn.com/api/tools/link-expander', { method: 'POST', body: JSON.stringify({ url: 'x'.repeat(2049) }) }));
    expect(response.status).toBe(400);
  });

  test('throttles excessive requests per client', async () => {
    const { POST } = await import('./route');
    const makeRequest = () => new Request('https://www.minifyn.com/api/tools/link-expander', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': 'rate-test' }, body: JSON.stringify({ url: 'https://short.example/a' }) });
    for (let index = 0; index < 30; index += 1) await POST(makeRequest());
    expect((await POST(makeRequest())).status).toBe(429);
  });
});
