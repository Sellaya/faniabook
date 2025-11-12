import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

export function getFirebaseAdminApp(): App {
  if (getApps().length) {
    return getApp();
  }

  return initializeApp({
    credential: serviceAccount ? require('firebase-admin/app').cert(serviceAccount) : undefined,
  });
}
