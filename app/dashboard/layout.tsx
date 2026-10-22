import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { connection } from 'next/server';
import { auth, signOut } from '@/auth';
import { apiFetch } from '@/lib/api';
import { Brand } from '../components/brand';
import { CreditsBadge } from './credits-badge';

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

  // Best-effort -- a hiccup fetching the balance shouldn't take down the
  // whole dashboard shell, just hide the badge for that one request.
  let me: { plan: 'FREE' | 'PREMIUM'; creditsBalance: number } | null = null;
  try {
    const meRes = await apiFetch('/users/me');
    if (meRes.ok) me = await meRes.json();
  } catch {
    // ignore -- badge just won't render this request
  }

  const navLinks = (
    <>
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
    </>
  );

  const signOutForm = (
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
  );

  return (
    <div className="flex flex-1 flex-col">
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--surface)',
        }}
      >
        {/* Checkbox-driven mobile menu -- no client component needed just
            to toggle a panel's visibility. peer-checked below targets the
            mobile-only panel, which comes later as a sibling of this. */}
        <input type="checkbox" id="mobile-nav-toggle" className="peer hidden" />
        <div className="flex items-center justify-between gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/dashboard/profile">
              <Brand size="sm" />
            </Link>
            <nav className="hidden gap-0.5 text-sm sm:flex sm:gap-1">{navLinks}</nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {me && <CreditsBadge plan={me.plan} creditsBalance={me.creditsBalance} />}
            <div className="hidden sm:block">{signOutForm}</div>
            <label
              htmlFor="mobile-nav-toggle"
              className="flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-lg sm:hidden"
              style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </label>
          </div>
        </div>
        {/* Mobile-only dropdown panel -- shown when the checkbox above is
            checked, never rendered at sm and up regardless of its state. */}
        <div
          className="hidden flex-col gap-1 px-4 pb-3 text-sm max-sm:peer-checked:flex"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <div className="flex flex-col gap-1 pt-2">{navLinks}</div>
          {signOutForm}
        </div>
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
