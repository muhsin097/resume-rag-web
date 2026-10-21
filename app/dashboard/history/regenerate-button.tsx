'use client';

import { useActionState } from 'react';
import { regenerateResumeGeneration } from './actions';
import { FullPageLoader } from '../../components/full-page-loader';

// Rendered as a sibling of <summary>, never nested inside it -- so
// clicking the button never also toggles the parent <details> open/closed.
export function RegenerateButton({ jobDescription }: { jobDescription: string }) {
  const [state, formAction, isPending] = useActionState(regenerateResumeGeneration, {});

  return (
    <div className="mt-2">
      <form action={formAction}>
        <input type="hidden" name="jobDescription" value={jobDescription} />
        <button type="submit" disabled={isPending} className="btn-secondary text-xs">
          {isPending ? 'Regenerating...' : 'Regenerate with updated profile'}
        </button>
        {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
      </form>

      {isPending && (
        <FullPageLoader label="Generating a fresh version from your updated profile..." />
      )}

      {/* A new entry lands at the top of this same list -- the old row
          being regenerated stays untouched below it, so this points up
          rather than trying to highlight anything inline here. */}
      {state.success && !isPending && (
        <p
          className="mt-2 flex items-center gap-1.5 text-xs font-medium"
          style={{ color: 'var(--accent)' }}
        >
          <span aria-hidden="true" className="motion-safe:animate-bounce">
            &uarr;
          </span>
          New version generated -- see it at the top of your history
        </p>
      )}
    </div>
  );
}
