'use client';

import { useEffect } from 'react';

// Catches errors thrown by the root layout itself (a provider, a font
// load, etc.) -- app/error.tsx can't see those, only errors in its own
// children. Next.js replaces the ENTIRE document with this when it fires,
// so it renders its own <html>/<body> and deliberately avoids importing
// anything from the app (components, Tailwind-dependent classes, Brand's
// next/image) -- if the root layout is what broke, the fewer things this
// fallback depends on, the more likely it is to actually render.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ maxWidth: '24rem', fontSize: '0.875rem', color: '#666', margin: 0 }}>
          Please try again. If this keeps happening, let us know.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            border: 'none',
            background: '#6D28D9',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
