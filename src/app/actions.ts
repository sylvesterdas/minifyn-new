
'use server';

import { urlSchema } from '@/lib/schema';
import { checkRateLimit, createShortLink, incrementUsage, type UserPlan } from '@/lib/data';
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

async function getUserPlan(userId: string): Promise<UserPlan> {
    if (userId === SUPER_USER_ID) return 'admin';
    try {
        const user = await auth().getUser(userId);
        if (!user.emailVerified) return 'anonymous';
        // You might have a 'plan' field in your user's custom claims or DB profile
        // For now, we'll assume verified users are on the 'free' plan.
        return 'free'; 
    } catch (error) {
        return 'anonymous';
    }
}

export async function shortenUrl(prevState: FormState, formData: FormData): Promise<FormState> {
    // Trigger maintenance task in the background (fire and forget)
    triggerMaintenance();

    const userId = formData.get('userId');
    if (typeof userId !== 'string' || !userId) {
        // This should ideally not happen if the client-side sends the UID correctly.
        return { success: false, message: 'Authentication context is missing. Please refresh the page.' };
    }
    
    // Check rate limit first
    const isAllowed = await checkRateLimit(userId);
    if (!isAllowed) {
        const plan = await getUserPlan(userId);
        if (plan === 'free' || plan === 'pro') {
             return { success: false, message: 'Your daily link creation limit has been reached.' };
        }
        if (plan === 'anonymous') {
             return { 
                success: false, 
                message: 'Daily limit of 3 URLs reached for guests.',
                errorCode: 'ANON_LIMIT_REACHED'
            };
        }
        return { success: false, message: 'Rate limit exceeded.' };
    }
    
    const validatedFields = await urlSchema.safeParseAsync({
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
        const newLink = await createShortLink({ longUrl, userId });
        
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
