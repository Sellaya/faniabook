'use server';

import { getAuth } from 'firebase-admin/auth';
import { redirect } from 'next/navigation';
import { getFirebaseAdminApp } from '@/firebase/admin';

export async function register(prevState: { message: string }, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const app = await getFirebaseAdminApp();
    const auth = getAuth(app);
    await auth.createUser({
      email,
      password,
      displayName: name,
    });
  } catch (e: any) {
    return { message: e.message };
  }

  redirect('/');
}
