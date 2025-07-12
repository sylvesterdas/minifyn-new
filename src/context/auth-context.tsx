'use client';

import type { Session, User } from 'lucia';
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
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
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
