import { getApps, initializeApp, cert, getApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getDatabase, type Database } from 'firebase-admin/database';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

export const getAdminApp = (): App => {
  if (getApps().length > 0) {
    return getApp();
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

  if (!privateKey || !clientEmail || !projectId || !databaseURL) {
    throw new Error(
      'Firebase Admin SDK environment variables are not set. Please check your .env file.'
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL: databaseURL,
  });
};

function createLazyProxy<T extends object>(getter: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop, receiver) {
      const instance = getter();
      const value = Reflect.get(instance, prop, receiver);
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });
}

export const auth: Auth = createLazyProxy(() => getAuth(getAdminApp()));
export const db: Database = createLazyProxy(() => getDatabase(getAdminApp()));
export const messaging: Messaging = createLazyProxy(() => getMessaging(getAdminApp()));

