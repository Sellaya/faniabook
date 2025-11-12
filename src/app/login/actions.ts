'use server';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from "firebase-admin/auth";
import { redirect } from 'next/navigation';
import {getFirebaseAdminApp} from '@/firebase/admin';

export async function login(prevState: { message: string }, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const app = await getFirebaseAdminApp();
    const auth = getAuth(app);
    // This is a stand-in for a real sign-in mechanism
    // In a real app, you'd validate this against your user database
    // For now, we just redirect.
    
    // The following is commented out because we don't have a client-side auth instance here.
    // We would typically call a client-side endpoint or use a server-side SDK differently.
    // await signInWithEmailAndPassword(auth, email, password);
    
  } catch (e: any) {
    return { message: e.message };
  }
  redirect('/');
}
