import * as Sentry from '@sentry/nextjs';

// No-ops automatically if the DSN is unset (local dev) -- safe to run
// unconditionally.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0,
});
