'use client';

import type { AuthUser } from '@/lib/auth';
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const AuthProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AuthContextType;
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
