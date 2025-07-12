import { Lucia } from 'lucia';

// Dummy adapter for in-memory storage to get started.
// In a real application, you should use a persistent adapter.
// Since we are using Firebase for user management, we only need to store sessions.
// For production, consider a more robust solution like a Firebase Realtime Database adapter if available, or another persistent store.
function InMemoryAdapter() {
    // Session and User maps
    const sessions = new Map<string, any>();
    const users = new Map<string, any>();

    return {
        // We manage users via Firebase Admin SDK, so user-related methods in the adapter are not critical.
        // The getSessionAndUser is the most important one for validating sessions.
        
        getSessionAndUser: async function(sessionId: string): Promise<[any, any]> {
            const session = sessions.get(sessionId);
            if (!session) return [null, null];
            // Since we don't store users in this adapter, we create a stub user object
            // The actual user data will be fetched from Firebase in `validateRequest`
            const user = { id: session.userId, ...session.userAttributes };
            return [session, user];
        },
        
        setSession: async function(session: any) {
            sessions.set(session.id, session);
        },
        
        deleteSession: async function(sessionId: string) {
            sessions.delete(sessionId);
        },

        updateSessionExpiration: async function(sessionId: string, expiresAt: Date) {
            const session = sessions.get(sessionId);
            if (session) {
                session.expiresAt = expiresAt;
            }
        },

        deleteUserSessions: async function(userId: string) {
            sessions.forEach((session: any, id: any) => {
                if (session.userId === userId) {
                    sessions.delete(id);
                }
            });
        },
        
        getUserSessions: async function(userId: string): Promise<any[]> {
            const userSessions = [];
            for (const session of sessions.values()) {
                if (session.userId === userId) {
                    userSessions.push(session);
                }
            }
            return userSessions;
        },
        
        deleteExpiredSessions: async function() {
            const now = new Date();
            sessions.forEach((session, sessionId) => {
                if (session.expiresAt <= now) {
                    sessions.delete(sessionId);
                }
            });
        },
    };
}


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
    if (!attributes) {
        return {};
    }
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
