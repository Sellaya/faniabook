// src/firebase/admin.ts
import { initializeApp, cert, getApps, getApp, App } from 'firebase-admin/app';

// Support either base64 or plain JSON env
const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ?? process.env.FIREBASE_SERVICE_ACCOUNT;

let serviceAccount: any | undefined;

if (serviceAccountEnv) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
      ? Buffer.from(serviceAccountEnv, 'base64').toString('utf-8')
      : serviceAccountEnv;
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse Firebase service account JSON', err);
  }
}

// ✅ Must be async for Next.js server actions
export async function getFirebaseAdminApp(): Promise<App> {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
  });
}
