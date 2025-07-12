import { lucia } from './lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { Session, User } from 'lucia';
import { auth as adminAuth } from './firebase-admin';

interface AuthUser extends User {
    email: string | null;
    emailVerified: boolean;
    photoURL?: string;
}

export const validateRequest = cache(
  async (): Promise<{ user: AuthUser | null; session: Session | null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // Next.js throws error when attempting to set cookies when rendering page
    }

    if (!result.user) {
        return { user: null, session: result.session }
    }

    // Enhance lucia user with Firebase user details
    const firebaseUser = await adminAuth.getUser(result.user.id);

    const user: AuthUser = {
        ...result.user,
        email: firebaseUser.email || null,
        emailVerified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL,
    }

    return { user, session: result.session };
  }
);
