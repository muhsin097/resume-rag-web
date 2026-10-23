'use client';

import { useState, useTransition } from 'react';
import { confirmStillOngoing, setItemEndDate } from './actions';

interface LegacyItem {
  id: string;
  title: string;
  organization: string | null;
}

// One row per flagged item: a quick "still ongoing" confirm, or an
// inline date picker for "it actually ended." Each row manages its own
// pending/open state independently, so confirming one item doesn't
// disable the others.
function LegacyItemRow({ item }: { item: LegacyItem }) {
  const [editing, setEditing] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      try {
        await confirmStillOngoing(item.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not confirm this item.');
      }
    });
  }

  function handleSaveEndDate() {
    if (!endDate) return;
    setError(null);
    startTransition(async () => {
      try {
        await setItemEndDate(item.id, endDate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save the end date.');
      }
    });
  }

  return (
    <li className="flex flex-col gap-2 py-2.5 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {item.title}
          {item.organization ? ` at ${item.organization}` : ''}
        </p>
        {!editing && (
          <div className="flex items-center gap-3 text-sm">
            <button type="button" onClick={handleConfirm} disabled={isPending} className="link">
              {isPending ? 'Saving...' : 'Still ongoing'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={isPending}
              className="link"
            >
              It actually ended
            </button>
          </div>
        )}
      </div>
      {editing && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input w-auto"
          />
          <button
            type="button"
            onClick={handleSaveEndDate}
            disabled={isPending || !endDate}
            className="btn-primary px-3 py-1 text-xs"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError(null);
            }}
            disabled={isPending}
            className="link text-sm"
          >
            Cancel
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </li>
  );
}

// Flags rows whose "currently ongoing" status was backfilled by the
// isCurrent migration, not something the candidate actually confirmed --
// before that migration, a blank end date always just meant "ended, date
// unknown," rendered as "Present" by the old logic either way. Shown
// until each item is resolved (either direction removes it, see
// confirmStillOngoing/setItemEndDate).
export function LegacyDatesBanner({ items }: { items: LegacyItem[] }) {
  return (
    <section className="card-muted space-y-2 border-amber-200 bg-amber-50">
      <div>
        <p className="text-sm font-medium text-amber-900">
          Quick check: {items.length} {items.length === 1 ? 'entry shows' : 'entries show'} as
          currently ongoing
        </p>
        <p className="text-xs text-amber-800">
          These predate a recent update and were left as &quot;Present&quot; by default -- just
          confirm that&apos;s still accurate, or add a real end date if it&apos;s not.
        </p>
      </div>
      <ul className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
        {items.map((item) => (
          <LegacyItemRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
