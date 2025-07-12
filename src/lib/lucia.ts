import { Lucia } from 'lucia';
import { NodePostgresAdapter } from '@lucia-auth/adapter-postgresql';
import { Pool } from 'pg';

// In-memory adapter for demonstration purposes.
// Replace with a persistent adapter in production.
const adapter = {
    sessions: new Map(),
    users: new Map(),
    
    deleteSession: async (sessionId: string) => {
        adapter.sessions.delete(sessionId);
    },
    deleteUserSessions: async (userId: string) => {
        adapter.sessions.forEach((session, key) => {
            if (session.userId === userId) {
                adapter.sessions.delete(key);
            }
        });
    },
    getSessionAndUser: async (sessionId: string) => {
        const session = adapter.sessions.get(sessionId);
        if (!session) return [null, null];
        const user = adapter.users.get(session.userId);
        if (!user) return [null, null];
        return [session, user];
    },
    getUserSessions: async (userId: string) => {
        const sessions = [];
        for (const session of adapter.sessions.values()) {
            if (session.userId === userId) {
                sessions.push(session);
            }
        }
        return sessions;
    },
    setSession: async (session: any) => {
        adapter.sessions.set(session.id, session);
    },
    updateSessionExpiration: async (sessionId: string, expiresAt: Date) => {
        const session = adapter.sessions.get(sessionId);
        if (session) {
            session.expiresAt = expiresAt;
            adapter.sessions.set(sessionId, session);
        }
    },
     // Not used by Lucia directly, but helpful for our actions
    setUser: (user: any) => {
        adapter.users.set(user.id, user);
    }
};

export const lucia = new Lucia(new InMemoryAdapter(), {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      emailVerified: attributes.emailVerified,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  emailVerified: boolean;
}

// Dummy adapter for in-memory storage to get started.
// In a real application, you should use a persistent adapter like @lucia-auth/adapter-postgresql
function InMemoryAdapter() {
    return {
        // Implement the adapter interface using in-memory maps
        // This is a simplified version and not recommended for production
        // Session and User maps
        sessions: new Map(),
        users: new Map(),

        // Methods
        deleteSession: async function(sessionId: string) {
            this.sessions.delete(sessionId);
        },
        deleteUserSessions: async function(userId: string) {
            this.sessions.forEach((session: any, id: any) => {
                if (session.userId === userId) {
                    this.sessions.delete(id);
                }
            });
        },
        getSessionAndUser: async function(sessionId: string) {
            const session = this.sessions.get(sessionId);
            if (!session) return [null, null];
            const user = this.users.get(session.userId);
            if (!user) return [null, null];
            return [session, user];
        },
        getUserSessions: async function(userId: string) {
            const userSessions = [];
            for (const session of this.sessions.values()) {
                if (session.userId === userId) {
                    userSessions.push(session);
                }
            }
            return userSessions;
        },
        setSession: async function(session: any) {
            this.sessions.set(session.id, session);
        },
        updateSessionExpiration: async function(sessionId: string, expiresAt: Date) {
            const session = this.sessions.get(sessionId);
            if (session) {
                session.expiresAt = expiresAt;
            }
        },
        // We'll manage users through Firebase Admin, so these can be stubs
        deleteExpiredSessions: async function() {
            //_
        },
    };
}
