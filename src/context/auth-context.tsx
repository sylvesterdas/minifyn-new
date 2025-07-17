
'use client';

import type { AuthUser } from '@/lib/auth';
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth as firebaseClientAuth } from '@/lib/firebase';
import { createContext, useContext, useEffect, useState } from 'react';
import { validateRequest } from '@/lib/auth';

interface AuthContextType {
  user: (AuthUser & { isAnonymous?: boolean }) | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<(AuthUser & { isAnonymous?: boolean }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This listener handles all auth state changes, including sign-in, sign-out,
    // and token refreshes.
    const unsubscribe = onIdTokenChanged(firebaseClientAuth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            // When a user is detected on the client, we still trust the server's
            // view of the user for custom claims and other sensitive data.
            // We re-validate the request to get the server-side user object.
            const { user: serverUser } = await validateRequest();
            setUser({
                ...serverUser, // This will have plan, onboarding status, etc.
                // We add the client-side properties that are useful.
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                picture: firebaseUser.photoURL,
                email_verified: firebaseUser.emailVerified,
                isAnonymous: firebaseUser.isAnonymous,
            } as AuthUser);
        } else {
            // User is signed out
            setUser(null);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
