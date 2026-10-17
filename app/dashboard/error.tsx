'use client';

import { ApiDownMessage, GenericErrorMessage } from '../components/api-down';

export default function DashboardError({
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
