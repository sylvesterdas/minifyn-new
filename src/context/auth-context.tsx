'use client';

import type { AuthUser } from '@/lib/auth';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth as firebaseClientAuth } from '@/lib/firebase';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export const AuthProvider = ({
  children,
  serverUser,
}: {
  children: React.ReactNode;
  serverUser: AuthUser | null;
}) => {
  const [user, setUser] = useState<AuthUser | null>(serverUser);
  const [isLoading, setIsLoading] = useState(serverUser === null); // Only true if server has no user

  useEffect(() => {
    if (serverUser) {
      // If we have a server user, we don't need to listen for changes
      // on the client, as the session is managed by the cookie.
      // We set isLoading to false immediately.
      setIsLoading(false);
      return;
    }

    // If there's no server user, we listen for client-side auth changes
    // (e.g., anonymous sign-in).
    const unsubscribe = onAuthStateChanged(firebaseClientAuth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
             // This logic is primarily for anonymous users on the client.
             // For full users, the serverUser should be present.
            setUser({
                ...firebaseUser.toJSON() as any, // Not a perfect mapping, but ok for anon
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                email_verified: firebaseUser.emailVerified
            });
        } else {
            setUser(null);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [serverUser]);

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
