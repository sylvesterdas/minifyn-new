
import { z } from 'zod';
import { isUrlSafe } from './webrisk';

const BLOCKED_EXTENSIONS = [
  '.exe', '.msi', '.apk', '.bat', '.cmd', '.vbs', '.scr', '.pif', '.hta', '.iso', '.jar', '.com', '.wsf', '.cpl'
];

export const urlSchema = z.object({
  longUrl: z.string()
    .min(1, { message: 'URL is required.' })
    .url({ message: 'Please enter a valid URL.' })
    .refine((val) => {
      try {
        const parsed = new URL(val);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    }, { message: 'Only HTTP and HTTPS URLs are allowed.' })
    .refine((val) => {
      try {
        const parsed = new URL(val);
        const pathname = parsed.pathname.toLowerCase();
        return !BLOCKED_EXTENSIONS.some((ext) => pathname.endsWith(ext));
      } catch {
        return false;
      }
    }, { message: 'Direct links to executable or script files are not permitted.' }),
}).superRefine(async (data, ctx) => {
    const isSafe = await isUrlSafe(data.longUrl);
    if (!isSafe) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This URL is considered unsafe and cannot be shortened.",
            path: ['longUrl'],
        });
    }
});


