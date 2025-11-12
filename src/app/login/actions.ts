'use server';

import { redirect } from 'next/navigation';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '@/firebase/admin';

export async function login(
  prevState: { message: string },
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  try {
    const app = await getFirebaseAdminApp();
    const auth = getAuth(app);
    // In a real app, you would verify the password here.
    // For this mock app, we'll just check if the user exists.
    await auth.getUserByEmail(email);
  } catch (e: any) {
    if (e.code === 'auth/user-not-found') {
      return { message: 'Invalid email or password.' };
    }
    return { message: 'An unexpected error occurred. Please try again.' };
  }

  // On successful "login", redirect to the homepage.
  redirect('/');
}
