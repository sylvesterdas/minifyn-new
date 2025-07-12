'use server';

import { cookies } from 'next/headers';
import { cache } from 'react';
import { auth as adminAuth } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthUser extends DecodedIdToken {
    // Add any custom properties if needed
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
      return { user: decodedClaims as AuthUser };
    } catch (error: any) {
      // Session cookie is invalid or expired.
      // In a real app, you would want to log this error.
      return { user: null };
    }
  }
);
