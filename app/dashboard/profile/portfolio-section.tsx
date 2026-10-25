'use client';

import { useActionState, useEffect, useState } from 'react';
import { setPortfolioEnabled, updatePortfolioSlug, type PortfolioSlugState } from './actions';
import { suggestSlug } from '@/lib/suggest-slug';

const SITE_URL = 'https://ceasetoresume.online';

export function PortfolioSection({
  name,
  portfolioEnabled,
  portfolioSlug,
}: {
  name: string;
  portfolioEnabled: boolean;
  portfolioSlug: string | null;
}) {
  const [slugState, slugAction, isSavingSlug] = useActionState<PortfolioSlugState, FormData>(
    updatePortfolioSlug,
    {},
  );
  const [editingSlug, setEditingSlug] = useState(!portfolioSlug);
  const [copied, setCopied] = useState(false);

  // A successful save re-renders this component with a fresh
  // portfolioSlug prop (the action's revalidatePath re-runs the Server
  // Component tree) -- switch back to the display view once that lands.
  useEffect(() => {
    if (slugState.success) setEditingSlug(false);
  }, [slugState.success]);

  const url = portfolioSlug ? `${SITE_URL}/p/${portfolioSlug}` : null;

  function handleCopy() {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="card space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">Public portfolio</h2>
          <p className="text-sm muted">
            A shareable page with your experience and evidence-ranked skills -- no login
            required to view it.
          </p>
        </div>
        <form
          action={async () => {
            await setPortfolioEnabled(!portfolioEnabled);
          }}
        >
          <button
            type="submit"
            className={portfolioEnabled ? 'btn-primary' : 'btn-secondary'}
          >
            {portfolioEnabled ? 'Portfolio: ON' : 'Portfolio: OFF'}
          </button>
        </form>
      </div>

      {portfolioEnabled && (
        <div className="space-y-2 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
          {!editingSlug && url ? (
            <div className="flex flex-wrap items-center gap-3">
              <a href={url} target="_blank" rel="noopener noreferrer" className="link text-sm">
                {url}
              </a>
              <button type="button" onClick={handleCopy} className="btn-secondary px-2.5 py-1 text-xs">
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              <button
                type="button"
                onClick={() => setEditingSlug(true)}
                className="link text-xs"
              >
                Change URL
              </button>
            </div>
          ) : (
            <form action={slugAction} className="flex flex-wrap items-center gap-2">
              <span className="text-sm muted">{SITE_URL}/p/</span>
              <input
                type="text"
                name="portfolioSlug"
                required
                minLength={3}
                maxLength={40}
                defaultValue={portfolioSlug ?? suggestSlug(name)}
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                title="Lowercase letters, numbers, and single hyphens only"
                className="input w-auto flex-1"
                style={{ minWidth: '160px' }}
              />
              <button type="submit" disabled={isSavingSlug} className="btn-primary px-3 py-1.5 text-sm">
                {isSavingSlug ? 'Saving...' : 'Save'}
              </button>
              {portfolioSlug && (
                <button
                  type="button"
                  onClick={() => setEditingSlug(false)}
                  className="link text-sm"
                >
                  Cancel
                </button>
              )}
            </form>
          )}
          {slugState.error && <p className="text-xs text-red-600">{slugState.error}</p>}
        </div>
      )}
    </section>
  );
}
