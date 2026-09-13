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

/**
 * Store availability is intentionally controlled here. A listing stays out of
 * MiniFyn surfaces until Chrome Web Store approval is complete and its public
 * store URL has been recorded.
 */
export const EXTENSIONS: ExtensionMetadata[] = [
  {
    id: 'scamguard-link-checker',
    name: 'ScamGuard: Link Checker',
    description: 'Check visible link warning signs locally before opening a site.',
    browser: 'chrome',
    version: null,
    status: 'submitted',
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

export const publishedExtensions = EXTENSIONS.filter(
  (extension) => extension.published && extension.status === 'published' && extension.storeUrl,
);
