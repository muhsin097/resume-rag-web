'use client';

import { useEffect, useState, useTransition } from 'react';
import { enablePortfolioQuickstart } from './actions';

// Kept in sync with the identical helper in portfolio-section.tsx --
// not shared because each file's version is tiny and the two components
// never need to agree on anything beyond "a reasonable URL-safe guess".
function suggestSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

const DISMISS_KEY = 'portfolio-nudge-dismissed';

// Opt-in-with-a-nudge: the portfolio stays private by default (no
// silent default flip), but someone who's already added real profile
// content gets a prominent, one-click, dismissible prompt to turn it
// on. Dismissal is client-side only (localStorage, not a DB column) --
// re-prompting on a new device is an acceptable tradeoff for how little
// this needs to persist.
export function PortfolioNudgeBanner({ name }: { name: string }) {
  const [visible, setVisible] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== 'true');
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  }

  function handleEnable() {
    setError(null);
    startTransition(async () => {
      try {
        await enablePortfolioQuickstart(suggestSlug(name));
        // Success re-renders the parent with portfolioEnabled: true via
        // revalidatePath, which stops this banner from being rendered
        // at all -- no local "enabled" state needed here.
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not enable your portfolio.');
      }
    });
  }

  if (!visible) return null;

  return (
    <section
      className="card flex flex-wrap items-center justify-between gap-3"
      style={{ borderColor: 'var(--accent)' }}
    >
      <div>
        <p className="font-medium">Make your portfolio public?</p>
        <p className="text-sm muted">
          A shareable page recruiters (and Google) can find -- built from what you&apos;ve already added here.
        </p>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button type="button" onClick={handleEnable} disabled={isPending} className="btn-primary">
          {isPending ? 'Enabling...' : 'Enable my portfolio'}
        </button>
        <button type="button" onClick={dismiss} className="link text-sm">
          Maybe later
        </button>
      </div>
    </section>
  );
}
