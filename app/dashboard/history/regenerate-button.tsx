'use client';

import { useActionState } from 'react';
import { regenerateResumeGeneration } from './actions';

// Rendered as a sibling of <summary>, never nested inside it -- so
// clicking the button never also toggles the parent <details> open/closed.
export function RegenerateButton({ jobDescription }: { jobDescription: string }) {
  const [state, formAction, isPending] = useActionState(regenerateResumeGeneration, {});

  return (
    <form action={formAction} className="mt-2">
      <input type="hidden" name="jobDescription" value={jobDescription} />
      <button type="submit" disabled={isPending} className="btn-secondary text-xs">
        {isPending ? 'Regenerating...' : 'Regenerate with updated profile'}
      </button>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
