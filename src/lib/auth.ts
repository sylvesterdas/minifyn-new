
'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { auth as adminAuth, db } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthUser extends DecodedIdToken {
    onboardingCompleted?: boolean;
}

async function getOnboardingStatus(uid: string): Promise<boolean> {
    try {
        const snapshot = await db.ref(`user_profiles/${uid}/onboardingCompleted`).once('value');
        return snapshot.val() === true;
    } catch (error) {
        console.error(`Failed to check onboarding status for user ${uid}:`, error);
        // Fail open: if there's an error, assume they completed it to avoid blocking them.
        return true;
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
      
      const onboardingCompleted = await getOnboardingStatus(decodedClaims.uid);
      const user: AuthUser = { ...decodedClaims, onboardingCompleted };

      return { user };
    } catch (error: any) {
      // Session cookie is invalid or expired.
      // In a real app, you would want to log this error.
      return { user: null };
    }
  }
);
