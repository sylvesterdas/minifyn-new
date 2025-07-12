'use server';

import { urlSchema } from '@/lib/schema';
import { checkRateLimit, createShortLink, incrementUsage } from '@/lib/data';
import { auth } from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';
import { triggerMaintenance } from '@/lib/maintenance';

export interface FormState {
    success: boolean;
    message: string;
    shortUrl?: string;
}

export async function shortenUrl(prevState: FormState, formData: FormData): Promise<FormState> {
    // Trigger maintenance task in the background (fire and forget)
    triggerMaintenance();

    const userId = formData.get('userId');
    if (typeof userId !== 'string' || !userId) {
        // This should ideally not happen if the client-side sends the UID correctly.
        return { success: false, message: 'Authentication context is missing. Please refresh the page.' };
    }
    
    let userRecord: UserRecord | null = null;
    let isVerifiedUser = false;
    try {
        // Check if the user is a registered user (not anonymous)
        userRecord = await auth().getUser(userId);
        isVerifiedUser = userRecord.emailVerified;
    } catch (error) {
        // This error means the user is likely anonymous, which is expected.
        isVerifiedUser = false;
    }

    // Check rate limit for users without a verified email (anonymous or unverified).
    if (!isVerifiedUser) {
        const isAllowed = await checkRateLimit(userId);
        if (!isAllowed) {
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
        const newLink = await createShortLink({ longUrl, userId, isVerifiedUser });
        
        // Increment usage count only after successful link creation for unverified users
        if (!isVerifiedUser) {
            await incrementUsage(userId);
        }

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
