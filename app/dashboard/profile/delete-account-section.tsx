'use client';

import { useState } from 'react';
import { deleteAccount } from './actions';

// Two-step confirm (reveal, then a separate explicit button) rather than
// a single click -- this is the one destructive, irreversible action on
// the whole profile page.
export function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount();
    } catch {
      setDeleting(false);
      setError('Could not delete account. Try again.');
    }
  }

  return (
    <section className="card space-y-3" style={{ borderColor: '#fca5a5' }}>
      <h2 className="text-sm font-semibold text-red-600">Danger zone</h2>

      {!confirming ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm muted">
            Permanently delete your account, profile, and generation history.
          </p>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="btn-secondary text-red-600"
          >
            Delete account
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">
            This permanently deletes your experience items, skills, and generation
            history, and can&apos;t be undone. Are you sure?
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="btn-primary"
              style={{ background: '#dc2626' }}
            >
              {deleting ? 'Deleting...' : 'Yes, delete my account'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
