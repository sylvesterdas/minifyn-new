import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getMessaging } from 'firebase-admin/messaging';

const getAdminApp = () => {
  if (getApps().length) {
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

const adminApp = getAdminApp();

export const auth = getAuth(adminApp);
export const db = getDatabase(adminApp);
export const messaging = getMessaging(adminApp);
