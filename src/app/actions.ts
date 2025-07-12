'use server';

import { headers } from 'next/headers';
import { urlSchema } from '@/lib/schema';
import { checkRateLimit, createShortLink } from '@/lib/data';
import { auth } from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';

export interface FormState {
    success: boolean;
    message: string;
    shortUrl?: string;
}

export async function shortenUrl(prevState: FormState, formData: FormData): Promise<FormState> {
    const userId = formData.get('userId');
    if (typeof userId !== 'string' || !userId) {
        return { success: false, message: 'Authentication context is missing. Please refresh the page.' };
    }
    
    let userRecord: UserRecord | null = null;
    try {
        userRecord = await auth().getUser(userId);
    } catch (error) {
        // User not found, which is fine for anonymous users.
    }

    // Check rate limit for users without a verified email (anonymous or unverified).
    if (!userRecord || !userRecord.emailVerified) {
        const headersObj = await headers();
        const ip = headersObj.get('x-forwarded-for') ?? '127.0.0.1';
        if (!checkRateLimit(ip)) {
                return { success: false, message: 'Rate limit exceeded. Please try again tomorrow or sign up for a free account for higher limits.' };
        }
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
        const newLink = await createShortLink({ longUrl, userId, isVerifiedUser: !!userRecord?.emailVerified });
        
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
