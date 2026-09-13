import { NextRequest } from 'next/server';
import { describe, expect, test } from 'vitest';
import { GET, OPTIONS } from './route';

describe('/api/extensions catalog', () => {
  test('returns both extension records and cache metadata', async () => {
    const response = await GET(new NextRequest('https://www.minifyn.com/api/extensions'));

    expect(response.status).toBe(200);
    expect(response.headers.get('etag')).toBeTruthy();
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    const data = await response.json();
    expect(data).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'scamguard-link-checker', published: false, storeUrl: null }),
      expect.objectContaining({ id: 'minifyn-url-shortener', published: false, storeUrl: null }),
    ]));
  });

  test('honors a matching ETag', async () => {
    const initial = await GET(new NextRequest('https://www.minifyn.com/api/extensions'));
    const response = await GET(new NextRequest('https://www.minifyn.com/api/extensions', {
      headers: { 'if-none-match': initial.headers.get('etag')! },
    }));

    expect(response.status).toBe(304);
  });

  test('answers CORS preflight requests', async () => {
    const response = await OPTIONS();
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-methods')).toContain('GET');
  });
});
