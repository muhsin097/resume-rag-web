'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { ApiDownMessage, GenericErrorMessage } from './components/api-down';

// Root-level fallback -- app/dashboard/error.tsx and
// app/recruiter/(app)/error.tsx handle their own sections more
// specifically, this just makes sure nothing anywhere in the app ever
// shows Next.js's raw default crash screen.
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Next.js redacts error.message/stack from the client in production
  // builds, but the full object (plus .digest, which maps back to the
  // server-side log line) is still real here -- this is the only trace of
  // a render-time crash we'd otherwise have, so it's worth logging even
  // before there's a real monitoring service wired up to catch it.
  useEffect(() => {
    console.error('[error-boundary:root]', error);
    // API_UNAVAILABLE is a known, expected state (ApiDownMessage handles
    // it) -- not worth spending the error-tracking quota on, especially
    // since a real outage is exactly when it'd fire on every page load.
    if (error.message !== 'API_UNAVAILABLE') Sentry.captureException(error);
  }, [error]);

  if (error.message === 'API_UNAVAILABLE') {
    return <ApiDownMessage reset={reset} />;
  }
  return <GenericErrorMessage reset={reset} />;
}
