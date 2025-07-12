'use server';

import { headers } from 'next/headers';
import { urlSchema } from '@/lib/schema';
import { checkRateLimit, createShortLink, isSlugTaken } from '@/lib/data';

export interface FormState {
    success: boolean;
    message: string;
    shortUrl?: string;
}

export async function shortenUrl(prevState: FormState, formData: FormData): Promise<FormState> {
    const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
    
    if (!checkRateLimit(ip)) {
        return { success: false, message: 'Rate limit exceeded. Please try again tomorrow.' };
    }
    
    const validatedFields = urlSchema.safeParse({
        longUrl: formData.get('longUrl'),
        customSlug: formData.get('customSlug'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            success: false,
            message: errors.longUrl?.[0] || errors.customSlug?.[0] || 'Invalid input.',
        };
    }
    
    const { longUrl, customSlug } = validatedFields.data;

    try {
        if(customSlug && await isSlugTaken(customSlug)) {
             return { success: false, message: 'This custom name is already taken.' };
        }
        
        const newLink = await createShortLink(longUrl, customSlug);
        
        const host = headers().get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const shortUrl = `${protocol}://${host}/${newLink.id}`;
        
        return {
            success: true,
            message: 'URL shortened successfully!',
            shortUrl: shortUrl,
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return {
            success: false,
            message,
        };
    }
}
