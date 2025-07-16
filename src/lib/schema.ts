
import { z } from 'zod';
import { isUrlSafe } from './webrisk';

export const urlSchema = z.object({
  longUrl: z.string()
    .min(1, { message: 'URL is required.' })
    .url({ message: 'Please enter a valid URL.' }),
}).superRefine(async (data, ctx) => {
    // Because this is an async refinement, this code runs *after* the initial sync checks.
    const isSafe = await isUrlSafe(data.longUrl);
    if (!isSafe) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This URL is considered unsafe and cannot be shortened.",
            path: ['longUrl'],
        });
    }
});
