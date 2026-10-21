'use client';

import { useEffect } from 'react';
import { ApiDownMessage, GenericErrorMessage } from '../components/api-down';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[error-boundary:dashboard]', error);
  }, [error]);

  if (error.message === 'API_UNAVAILABLE') {
    return <ApiDownMessage reset={reset} />;
  }
  return <GenericErrorMessage reset={reset} />;
}
