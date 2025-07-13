'use server';

import { validateRequest } from '@/lib/auth';
import { db, auth } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

/**
 * Retrieves the API key for a given user ID.
 * @param uid The user ID to look up.
 * @returns The API key string, or null if not found.
 */
export async function getApiKeyForUser(uid: string): Promise<string | null> {
    try {
        const userApiKeySnapshot = await db.ref(`users_apikeys/${uid}`).once('value');
        if (!userApiKeySnapshot.exists()) {
            return null;
        }
        return userApiKeySnapshot.val().key;
    } catch (error) {
        console.error("Error fetching API key for user:", error);
        return null;
    }
}


export async function generateApiKey(): Promise<{ key: string } | { error: string }> {
    const { user } = await validateRequest();
    if (!user) {
        return { error: 'Unauthorized' };
    }
    
    // Check if user is email verified
    if (!user.email_verified) {
        return { error: 'Please verify your email to generate an API key.' };
    }

    // Check if the user already has a key (limit to one)
    const existingKeySnapshot = await db.ref(`users_apikeys/${user.uid}`).once('value');
    if (existingKeySnapshot.exists()) {
        return { error: 'You already have an active API key. Please revoke it before generating a new one.' };
    }

    // Generate a new key
    const newKey = `mk_${crypto.randomBytes(16).toString('hex')}`;

    try {
        const updates: { [key: string]: any } = {};
        updates[`/apikeys/${newKey}`] = { uid: user.uid };
        updates[`/users_apikeys/${user.uid}`] = { key: newKey };

        await db.ref().update(updates);
        
        revalidatePath('/dashboard/settings');
        return { key: newKey };
    } catch (error) {
        console.error("Failed to generate API key:", error);
        return { error: 'An unexpected error occurred while generating the key.' };
    }
}

export async function revokeApiKey(): Promise<{ success: boolean } | { error: string }> {
    const { user } = await validateRequest();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    try {
        const userApiKeySnapshot = await db.ref(`users_apikeys/${user.uid}`).once('value');
        if (!userApiKeySnapshot.exists()) {
            return { error: 'No active API key found to revoke.' };
        }

        const key = userApiKeySnapshot.val().key;
        
        const updates: { [key: string]: null } = {};
        updates[`/apikeys/${key}`] = null;
        updates[`/users_apikeys/${user.uid}`] = null;

        await db.ref().update(updates);

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error) {
        console.error("Failed to revoke API key:", error);
        return { error: 'An unexpected error occurred while revoking the key.' };
    }
}

export async function updateUserProfile(prevState: any, formData: FormData): Promise<{ success?: boolean; error?: string; message?: string }> {
    const { user } = await validateRequest();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;

    if (!name || name.trim().length < 2) {
        return { error: 'Name must be at least 2 characters long.' };
    }

    try {
        // Update Firebase Auth record
        await auth.updateUser(user.uid, {
            displayName: name,
        });
        
        // Update Realtime Database record
        await db.ref(`user_profiles/${user.uid}`).update({
            name: name,
        });
        
        revalidatePath('/dashboard/settings', 'page');

        return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Failed to update user profile:', error);
        return { error: 'An unexpected error occurred while updating your profile.' };
    }
}
