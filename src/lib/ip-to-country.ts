
'use server';

// A very simplified, non-production-ready IP to country mapping.
// In a real application, this should be replaced with a proper GeoIP database
// like MaxMind GeoLite2 or a service like ip-api.com.
// This is for demonstration purposes only.

const privateIpRanges = [
    { start: '10.0.0.0', end: '10.255.255.255' },
    { start: '172.16.0.0', end: '172.31.255.255' },
    { start: '192.168.0.0', end: '192.168.255.255' },
    { start: '127.0.0.0', end: '127.255.255.255' }, // localhost
];

function ipToLong(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

function isPrivateIp(ip: string): boolean {
    if (ip === '::1' || ip === '127.0.0.1') return true;
    const longIp = ipToLong(ip);
    return privateIpRanges.some(range => {
        const start = ipToLong(range.start);
        const end = ipToLong(range.end);
        return longIp >= start && longIp <= end;
    });
}

// Mock database of IP ranges to countries
const geoDb = [
  { start: '8.8.8.0', end: '8.8.8.255', country: 'US' }, // Google DNS (US)
  { start: '1.1.1.0', end: '1.1.1.255', country: 'AU' }, // Cloudflare DNS (Australia)
  { start: '208.67.222.0', end: '208.67.222.255', country: 'US' }, // OpenDNS (US)
  { start: '216.58.192.0', end: '216.58.223.255', country: 'US' }, // Google (US)
  { start: '142.250.0.0', end: '142.251.255.255', country: 'US' }, // Google (US)
  { start: '185.199.108.0', end: '185.199.111.255', country: 'US' }, // GitHub Pages (US)
  { start: '34.192.0.0', end: '34.255.255.255', country: 'US' }, // Amazon AWS (US)
  { start: '52.0.0.0', end: '52.255.255.255', country: 'US' }, // Amazon AWS (US)
  { start: '54.0.0.0', end: '54.255.255.255', country: 'US' }, // Amazon AWS (US)
  { start: '202.89.64.0', end: '202.89.127.255', country: 'IN' }, // India
  { start: '103.208.220.0', end: '103.208.220.255', country: 'IN' }, // India
  { start: '180.149.0.0', end: '180.149.255.255', country: 'IN' }, // India
  { start: '1.178.0.0', end: '1.179.255.255', country: 'AU' }, // Australia
  { start: '14.200.0.0', end: '14.203.255.255', country: 'AU' }, // Australia
  { start: '144.130.0.0', end: '144.140.255.255', country: 'AU' }, // Australia
  { start: '195.82.146.0', end: '195.82.146.255', country: 'DE' }, // Germany
  { start: '81.169.144.0', end: '81.169.255.255', country: 'DE' }, // Germany
  { start: '185.26.176.0', end: '185.26.179.255', country: 'DE' }, // Germany
  { start: '89.238.160.0', end: '89.238.191.255', country: 'GB' }, // UK
  { start: '151.224.0.0', end: '151.231.255.255', country: 'GB' }, // UK
  { start: '2.24.0.0', end: '2.31.255.255', country: 'GB' }, // UK
  { start: '103.1.204.0', end: '103.1.207.255', country: 'JP' }, // Japan
  { start: '124.155.128.0', end: '124.155.255.255', country: 'JP' }, // Japan
  { start: '210.130.128.0', end: '210.130.255.255', country: 'JP' }, // Japan
  { start: '177.0.0.0', end: '177.255.255.255', country: 'BR' }, // Brazil
  { start: '189.0.0.0', end: '189.127.255.255', country: 'BR' }, // Brazil
  { start: '200.96.0.0', end: '200.255.255.255', country: 'BR' }, // Brazil
];

export function getCountryFromIP(ip: string | null): string | null {
  if (!ip || ip.includes(':') || isPrivateIp(ip)) { // Basic IPv6 check and private IP check
    return null;
  }

  try {
    const longIp = ipToLong(ip);
    const result = geoDb.find(range => {
        const start = ipToLong(range.start);
        const end = ipToLong(range.end);
        return longIp >= start && longIp <= end;
    });

    return result ? result.country : null;
  } catch (e) {
    return null; // Invalid IP format
  }
}
