'use server';

import { headers } from 'next/headers';
import { urlSchema } from '@/lib/schema';
import { checkRateLimit, createShortLink } from '@/lib/data';
import { validateRequest } from '@/lib/auth';

export interface FormState {
    success: boolean;
    message: string;
    shortUrl?: string;
}

export async function shortenUrl(prevState: FormState, formData: FormData): Promise<FormState> {
    const { user } = await validateRequest();
    const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
    
    // Rate limit only applies to anonymous users
    if (!user && !checkRateLimit(ip)) {
        return { success: false, message: 'Rate limit exceeded. Please try again tomorrow.' };
    }
    
    const validatedFields = urlSchema.safeParse({
        longUrl: formData.get('longUrl'),
    });

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        return {
            success: false,
            message: errors.longUrl?.[0] || 'Invalid input.',
        };
    }
    
    const { longUrl } = validatedFields.data;

    try {
        const newLink = await createShortLink({ longUrl, userId: user?.uid });
        
        const host = 'mnfy.in';
        const shortUrl = `https://${host}/${newLink.id}`;
        
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
