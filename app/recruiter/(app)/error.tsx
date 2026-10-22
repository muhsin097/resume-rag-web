'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { ApiDownMessage, GenericErrorMessage } from '../../components/api-down';

export default function RecruiterAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[error-boundary:recruiter]', error);
    if (error.message !== 'API_UNAVAILABLE') Sentry.captureException(error);
  }, [error]);

  if (error.message === 'API_UNAVAILABLE') {
    return <ApiDownMessage reset={reset} />;
  }
  return <GenericErrorMessage reset={reset} />;
}
