import { z } from 'zod';

// A simple list of domains to block. In a real app, this would be more robust.
const blockedDomains = ['spam.com', 'phishing.net', 'evil.org'];

export const urlSchema = z.object({
  longUrl: z.string()
    .min(1, { message: 'URL is required.' })
    .url({ message: 'Please enter a valid URL.' })
    .refine(url => {
        try {
            const domain = new URL(url).hostname;
            // Block exact domains or subdomains of blocked domains.
            return !blockedDomains.some(blocked => domain === blocked || domain.endsWith(`.${blocked}`));
        } catch {
            return false;
        }
    }, { message: 'This domain is not allowed.' }),
  customSlug: z.string()
    .max(20, { message: 'Custom name must be 20 characters or less.' })
    .regex(/^[a-zA-Z0-9_-]*$/, {
        message: 'Custom name can only contain letters, numbers, hyphens, and underscores.'
    })
    .optional()
    .transform(slug => slug === '' ? undefined : slug),
});
