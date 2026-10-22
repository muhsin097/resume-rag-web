import * as Sentry from '@sentry/nextjs';

// Replay/feedback integrations deliberately omitted -- just error capture
// for now, not full session recording.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
