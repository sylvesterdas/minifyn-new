export const API_ORIGIN = 'https://www.minifyn.com';
export const API_KEY_PAGE = `${API_ORIGIN}/dashboard/settings/api-keys`;
export const SHORTEN_ENDPOINT = `${API_ORIGIN}/api/shorten`;

export function normalizeUrl(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) throw new Error('Enter a URL first.');
  let parsed;
  try { parsed = new URL(trimmed); } catch { throw new Error('Enter a valid URL.'); }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP and HTTPS links can be shortened.');
  }
  return parsed.href;
}

export function errorMessage(status, body = {}) {
  if (status === 401) return 'This API key is invalid, revoked, or needs a verified account.';
  if (status === 429) return body.error || 'Your API usage limit has been reached.';
  if (status === 400) return body.error || 'MiniFyn could not accept this URL.';
  if (status >= 500) return 'MiniFyn is temporarily unavailable. Try again shortly.';
  return body.error || 'The request could not be completed.';
}

export async function shortenUrl(url, apiKey, fetchImpl = fetch) {
  const normalized = normalizeUrl(url);
  if (!apiKey?.trim()) throw new Error('Add your MiniFyn API key before shortening.');
  let response;
  try {
    response = await fetchImpl(SHORTEN_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: normalized }),
    });
  } catch { throw new Error('Could not reach MiniFyn. Check your connection and try again.'); }
  let body = {};
  try { body = await response.json(); } catch { /* handled below */ }
  if (!response.ok) throw new Error(errorMessage(response.status, body));
  if (!body.shortUrl) throw new Error('MiniFyn returned no shortened URL.');
  return body.shortUrl;
}
