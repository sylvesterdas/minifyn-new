'use server';

import { headers } from 'next/headers';
import { urlSchema } from '@/lib/schema';
import { checkRateLimit, createShortLink } from '@/lib/data';
import { validateRequest } from '@/lib/auth';
import { auth } from 'firebase-admin';

export interface FormState {
    success: boolean;
    message: string;
    shortUrl?: string;
}

export async function shortenUrl(prevState: FormState, formData: FormData): Promise<FormState> {
    const { user } = await validateRequest();
    
    if (!user) {
        return { success: false, message: 'Authentication required. Please sign in or refresh the page.' };
    }

    const headersObj = await headers()
    const ip = headersObj.get('x-forwarded-for') ?? '127.0.0.1';
    
    const userRecord = await auth().getUser(user.uid);
    // Rate limit only applies to anonymous users (users without a verified email)
    if (!userRecord.emailVerified && !checkRateLimit(ip)) {
        return { success: false, message: 'Rate limit exceeded. Please try again tomorrow or sign up for an account.' };
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
        const newLink = await createShortLink({ longUrl, userId: user.uid });
        
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
