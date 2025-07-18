
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
        const snapshot = await db.ref(`user_profiles/${uid}`).once('value');
        if (snapshot.exists()) {
            const profile = snapshot.val() as UserProfile;
            return {
                plan: profile.plan || 'free',
                onboardingCompleted: profile.onboardingCompleted === true,
            };
        }
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
      return { user: null };
    }

    try {
      const decodedClaims = await adminAuth.verifySessionCookie(
        sessionCookie,
        true
      );
      
      const isAnonymous = decodedClaims.provider_id === 'anonymous';
      let plan: UserPlan = 'anonymous';
      let onboardingCompleted = false;

      if (!isAnonymous) {
          const profileData = await getUserProfileData(decodedClaims.uid);
          plan = profileData.plan;
          onboardingCompleted = profileData.onboardingCompleted;
      }
      
      const user: AuthUser = { ...decodedClaims, plan, onboardingCompleted, isAnonymous };

      return { user };
    } catch (error: any) {
      return { user: null };
    }
  }
);
