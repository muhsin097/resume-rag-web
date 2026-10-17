'use client';

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
  if (error.message === 'API_UNAVAILABLE') {
    return <ApiDownMessage reset={reset} />;
  }
  return <GenericErrorMessage reset={reset} />;
}
