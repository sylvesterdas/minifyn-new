
'use server';

import { urlSchema } from '@/lib/schema';
import { checkRateLimit, createShortLink, incrementUsage } from '@/lib/data';
import { auth } from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';
import { triggerMaintenance } from '@/lib/maintenance';
import { revalidatePath } from 'next/cache';
import { SUPER_USER_ID } from '@/lib/config';

export interface FormState {
    success: boolean;
    message: string;
    shortUrl?: string;
    errorCode?: 'ANON_LIMIT_REACHED';
}

export async function shortenUrl(prevState: FormState, formData: FormData): Promise<FormState> {
    // Trigger maintenance task in the background (fire and forget)
    triggerMaintenance();

    const userId = formData.get('userId');
    if (typeof userId !== 'string' || !userId) {
        // This should ideally not happen if the client-side sends the UID correctly.
        return { success: false, message: 'Authentication context is missing. Please refresh the page.' };
    }
    
    // Super user bypasses all checks
    if (userId === SUPER_USER_ID) {
        const validatedFields = await urlSchema.safeParseAsync({ longUrl: formData.get('longUrl') });
         if (!validatedFields.success) {
            return { success: false, message: 'Invalid URL for Super User.' };
        }
        const newLink = await createShortLink({ longUrl: validatedFields.data.longUrl, userId, isVerifiedUser: true });
        const host = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'mnfy.in';
        const shortUrl = `https://${host}/${newLink.id}`;
        revalidatePath('/dashboard/links');
        return { success: true, message: 'URL shortened successfully!', shortUrl };
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

    // Check rate limit.
    const isAllowed = await checkRateLimit(userId, isVerifiedUser);
    if (!isAllowed) {
        if (isVerifiedUser) {
            return { success: false, message: 'Daily limit of 20 URLs reached. Please try again tomorrow.' };
        } else {
             return { 
                success: false, 
                message: 'Daily limit of 3 URLs reached.',
                errorCode: 'ANON_LIMIT_REACHED'
            };
        }
    }
    
    const validatedFields = await urlSchema.safeParseAsync({
        longUrl: formData.get('longUrl'),
    });
    
    console.log('[Action] Validated fields result:', JSON.stringify(validatedFields, null, 2));

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
        
        // Increment usage count for all users after successful link creation
        await incrementUsage(userId);

        const host = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'mnfy.in';
        const shortUrl = `https://${host}/${newLink.id}`;
        
        revalidatePath('/dashboard/links');

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
