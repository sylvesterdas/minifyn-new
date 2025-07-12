import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// A function to initialize and get the admin app.
// This prevents race conditions and ensures the app is ready.
const getAdminApp = () => {
  // If the app is already initialized, return it.
  if (getApps().length) {
    return getApp();
  }

  // Get credentials from environment variables.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Crucial: Check if environment variables are loaded.
  // This provides a clear error instead of the cryptic one you were seeing.
  if (!privateKey || !clientEmail || !projectId) {
    throw new Error(
      'Firebase Admin SDK environment variables are not set. Please check your .env.local file.'
    );
  }

  // Initialize the app with the credentials.
  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
};

// Get the initialized app instance.
const adminApp = getAdminApp();

// Export the auth service, now guaranteed to be initialized correctly.
export const auth = getAuth(adminApp);
