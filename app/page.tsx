import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { auth } from '@/auth';

export const instant = false;

export default async function Home() {
  // auth() can touch crypto randomness internally -- `connection()` tells
  // Next this must run per-request, not during a prerender attempt.
  await connection();
  const session = await auth();
  redirect(session ? '/dashboard/profile' : '/login');
}
