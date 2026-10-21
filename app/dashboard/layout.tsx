import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { connection } from 'next/server';
import { auth, signOut } from '@/auth';
import { Brand } from '../components/brand';

// Route-level opt-out of static prerendering (this layout reads the
// session on every request to gate /dashboard/*).
export const instant = false;

// Signed-in-only pages have nothing for a crawler to usefully index, and
// shouldn't show up in search results pointing at someone's private data.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // auth() can touch crypto randomness internally -- `connection()` tells
  // Next this must run per-request, not during a prerender attempt.
  await connection();
  const session = await auth();
  if (!session || session.user.kind !== 'candidate') {
    redirect('/');
  }

  return (
    <div className="flex flex-1 flex-col">
      <header
        className="flex flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:px-6"
        style={{
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--surface)',
        }}
      >
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/dashboard/profile">
            <Brand size="sm" />
          </Link>
          <nav className="flex gap-0.5 text-sm sm:gap-1">
            <Link href="/dashboard/profile" className="btn-ghost px-2 sm:px-3.5">
              Profile
            </Link>
            <Link href="/dashboard/generate" className="btn-ghost px-2 sm:px-3.5">
              Generate
            </Link>
            <Link href="/dashboard/buy-credits" className="btn-ghost px-2 sm:px-3.5">
              Buy credits
            </Link>
            <Link href="/dashboard/history" className="btn-ghost px-2 sm:px-3.5">
              History
            </Link>
          </nav>
        </div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button type="submit" className="btn-ghost">
            Sign out<span className="hidden sm:inline"> ({session.user?.email})</span>
          </button>
        </form>
      </header>
      <main
        className="flex-1 p-4 sm:p-6"
        style={{ background: 'var(--background)' }}
      >
        {children}
      </main>
    </div>
  );
}
