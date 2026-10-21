'use client';

import { Brand } from './brand';

// `reset` is optional: error.tsx boundaries pass Next's own reset(), but
// Server Components can't pass a function prop across the RSC boundary --
// pages that catch apiFetch's API_UNAVAILABLE error directly (the only
// reliable way to detect it, since Next.js redacts error.message in
// production builds before error.tsx ever sees it) render this with no
// reset at all, so it just falls back to a full reload.
function retry(reset?: () => void) {
  if (reset) {
    reset();
  } else {
    window.location.reload();
  }
}

export function ApiDownMessage({ reset }: { reset?: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <Brand size="sm" />
      <h1 className="text-xl font-semibold">We&apos;re experiencing heavier load right now</h1>
      <p className="max-w-sm text-sm muted">
        This usually clears up within a few minutes. Please check back shortly.
      </p>
      <button type="button" onClick={() => retry(reset)} className="btn-primary">
        Try again
      </button>
    </div>
  );
}

// Anything else that wasn't specifically an API-down condition -- still
// friendly, but doesn't claim to know what happened.
export function GenericErrorMessage({ reset }: { reset?: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm muted">
        Please try again. If this keeps happening, let us know.
      </p>
      <button type="button" onClick={() => retry(reset)} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
