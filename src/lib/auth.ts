
'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { auth as adminAuth, db } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { UserPlan } from './data';
import type { UserProfile } from '@/app/dashboard/settings/actions';

export interface AuthUser extends DecodedIdToken {
    onboardingCompleted: boolean;
    plan: UserPlan;
    isAnonymous: boolean;
}

async function getUserProfileData(uid: string): Promise<{ plan: UserPlan, onboardingCompleted: boolean }> {
    try {
        const userProfileRef = db.ref(`user_profiles/${uid}`);
        const snapshot = await userProfileRef.once('value');
        
        if (snapshot.exists()) {
            const profile = snapshot.val();
            // This is a simplified check for the session validation.
            // The full downgrade logic lives in getUserPlan in data.ts to handle API calls too.
            // This just ensures the session reflects the most likely current state.
            let currentPlan = profile.plan || 'free';
             if (
                profile.plan === 'pro' &&
                profile.subscription &&
                profile.subscription.cancel_scheduled === true &&
                profile.subscription.current_end &&
                profile.subscription.current_end * 1000 < Date.now()
            ) {
                currentPlan = 'free';
            }

            return {
                plan: currentPlan,
                onboardingCompleted: profile.onboardingCompleted === true,
            };
        }
        
        // Default for users with no profile
        return { plan: 'free', onboardingCompleted: false };

    } catch (error) {
        console.error(`Failed to fetch profile data for user ${uid}:`, error);
        return { plan: 'free', onboardingCompleted: false };
    }
}

export const validateRequest = cache(
  async (): Promise<{ user: AuthUser | null }> => {
    const cookiesObj = await cookies()
    const sessionCookie = cookiesObj.get('session')?.value;

    if (!sessionCookie) {
      console.log('[Auth Lib] validateRequest: No session cookie found.');
      return { user: null };
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(
        sessionCookie,
        true
      );
      console.log(`[Auth Lib] validateRequest: Session cookie is valid for UID: ${decodedClaims.uid}`);
      
      const isAnonymous = decodedClaims.provider_id === 'anonymous';
      let plan: UserPlan = 'anonymous';
      let onboardingCompleted = false;

      if (!isAnonymous) {
          const profileData = await getUserProfileData(decodedClaims.uid);
          plan = profileData.plan;
          onboardingCompleted = profileData.onboardingCompleted;
      }
      
      const user: AuthUser = { ...decodedClaims, plan, onboardingCompleted, isAnonymous };
      console.log(`[Auth Lib] validateRequest: User object prepared for UID: ${user.uid} with plan: ${user.plan}`);

      return { user };
    } catch (error: any) {
      console.error(`[Auth Lib] ${error.message}`)
      console.error('[Auth Lib] validateRequest: Session cookie verification failed.', error.code);
      return { user: null };
    }
  }
);
