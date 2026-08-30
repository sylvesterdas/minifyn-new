import dns from 'node:dns/promises';

const MAX_HOPS = 10;
const TIMEOUT_MS = 5000;
export interface Hop { url: string; status: number; location?: string }
export interface ExpansionResult { finalUrl: string; hops: Hop[]; truncated: boolean }

function isPrivateAddress(address: string): boolean {
  const value = address.toLowerCase();
  if (value === '::1' || value === '0.0.0.0') return true;
  if (value.includes(':')) return value.startsWith('fc') || value.startsWith('fd') || value.startsWith('fe80');
  const parts = value.split('.').map(Number); const [a, b] = parts;
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

async function validateUrl(rawUrl: string): Promise<URL> {
  const url = new URL(rawUrl);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.');
  if (url.username || url.password) throw new Error('URLs with embedded credentials are not supported.');
  if (url.hostname === 'localhost' || url.hostname.endsWith('.localhost') || url.hostname.endsWith('.local') || url.hostname.endsWith('.internal')) throw new Error('Private or local destinations are not supported.');
  const addresses = await dns.lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error('Private or local destinations are not supported.');
  return url;
}

export async function expandLink(rawUrl: string): Promise<ExpansionResult> {
  let current = (await validateUrl(rawUrl.trim())).toString(); const hops: Hop[] = [];
  for (let index = 0; index < MAX_HOPS; index += 1) {
    let response = await fetch(current, { method: 'HEAD', redirect: 'manual', headers: { 'User-Agent': 'MiniFynLinkTracer/1.0' }, signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
    // Some short-link providers reject HEAD; a bounded GET is still server-side
    // and follows no redirects, so no destination page is executed in a browser.
    if (response.status === 405 || response.status === 501) {
      response = await fetch(current, { method: 'GET', redirect: 'manual', headers: { 'User-Agent': 'MiniFynLinkTracer/1.0', Range: 'bytes=0-0' }, signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
    }
    const location = response.headers.get('location') || undefined;
    hops.push({ url: current, status: response.status, ...(location ? { location } : {}) });
    if (!location || response.status < 300 || response.status >= 400) return { finalUrl: current, hops, truncated: false };
    current = (await validateUrl(new URL(location, current).toString())).toString();
  }
  return { finalUrl: current, hops, truncated: true };
}
