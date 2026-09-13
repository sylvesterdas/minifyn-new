import test from 'node:test';
import assert from 'node:assert/strict';
import { errorMessage, normalizeUrl, shortenUrl } from '../src/core.js';

test('normalizes only HTTP(S) URLs', () => {
  assert.equal(normalizeUrl(' https://example.com/a '), 'https://example.com/a');
  assert.throws(() => normalizeUrl('javascript:alert(1)'), /HTTP and HTTPS/);
  assert.throws(() => normalizeUrl('not a url'), /valid URL/);
});

test('sends the key and URL without logging or query parameters', async () => {
  let request;
  const value = await shortenUrl('https://example.com', 'mk_test', async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ shortUrl: 'https://mnfy.in/abc' }), { status: 200 });
  });
  assert.equal(value, 'https://mnfy.in/abc');
  assert.equal(request.url, 'https://www.minifyn.com/api/shorten');
  assert.equal(request.options.headers.Authorization, 'Bearer mk_test');
  assert.equal(JSON.parse(request.options.body).url, 'https://example.com/');
});

test('maps unauthorized, quota, and unsafe responses', async () => {
  for (const [status, body, expected] of [[401, {}, 'invalid'], [429, { error: 'Daily limit' }, 'Daily limit'], [400, { error: 'Unsafe URL' }, 'Unsafe URL']]) {
    await assert.rejects(() => shortenUrl('https://example.com', 'mk_test', async () => new Response(JSON.stringify(body), { status })), new RegExp(expected));
  }
  assert.match(errorMessage(503), /temporarily unavailable/);
});
