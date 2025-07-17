
'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { auth as adminAuth, db } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { UserPlan } from './data';
import type { UserProfile } from '@/app/dashboard/settings/actions';

export interface AuthUser extends DecodedIdToken {
    onboardingCompleted?: boolean;
    plan: UserPlan;
}

async function getUserProfileData(uid: string): Promise<{ plan: UserPlan, onboardingCompleted: boolean }> {
    try {
        const snapshot = await db.ref(`user_profiles/${uid}`).once('value');
        if (snapshot.exists()) {
            const profile = snapshot.val() as UserProfile;
            return {
                plan: profile.plan || 'free',
                onboardingCompleted: profile.onboardingCompleted || false,
            };
        }
        // Default values if no profile exists
        return { plan: 'free', onboardingCompleted: false };
    } catch (error) {
        console.error(`Failed to fetch profile data for user ${uid}:`, error);
        // Fail open: if there's an error, assume they are on the free plan to avoid blocking them.
        return { plan: 'free', onboardingCompleted: true };
    }
}

export const validateRequest = cache(
  async (): Promise<{ user: AuthUser | null }> => {
    const cookiesObj = await cookies()
    const sessionCookie = cookiesObj.get('session')?.value;

    if (!sessionCookie) {
      return { user: null };
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(
        sessionCookie,
        true // Check for revocation
      );
      
      const { plan, onboardingCompleted } = await getUserProfileData(decodedClaims.uid);
      const user: AuthUser = { ...decodedClaims, plan, onboardingCompleted };

      return { user };
    } catch (error: any) {
      // Session cookie is invalid or expired.
      // In a real app, you would want to log this error.
      return { user: null };
    }
  }
);
