import { redirect } from 'next/navigation';
import Link from 'next/link';
import { connection } from 'next/server';
import { auth, signOut } from '@/auth';
import { Brand } from '../components/brand';

// Route-level opt-out of static prerendering (this layout reads the
// session on every request to gate /dashboard/*).
export const instant = false;

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
        className="flex items-center justify-between px-6 py-3"
        style={{
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--surface)',
        }}
      >
        <div className="flex items-center gap-6">
          <Link href="/dashboard/profile">
            <Brand size="sm" />
          </Link>
          <nav className="flex gap-1 text-sm">
            <Link href="/dashboard/profile" className="btn-ghost">
              Profile
            </Link>
            <Link href="/dashboard/generate" className="btn-ghost">
              Generate
            </Link>
            <Link href="/dashboard/history" className="btn-ghost">
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
            Sign out ({session.user?.email})
          </button>
        </form>
      </header>
      <main
        className="flex-1 p-6"
        style={{ background: 'var(--background)' }}
      >
        {children}
      </main>
    </div>
  );
}
