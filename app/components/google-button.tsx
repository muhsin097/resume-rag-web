'use client';

import { signIn } from 'next-auth/react';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.89c2.27-2.09 3.58-5.17 3.58-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.92l-3.89-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09C3.28 21.3 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.31c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.66H1.3C.47 8.29 0 10.1 0 12s.47 3.71 1.3 5.34l4.01-3.03z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.7 1.3 6.66l4.01 3.03c.94-2.82 3.58-4.94 6.69-4.94z"
      />
    </svg>
  );
}

// Same backend exchange regardless of which page renders this -- the
// provider id alone decides whether /auth/oauth or /recruiter-auth/oauth
// gets hit (see auth.ts).
export function GoogleButton({
  provider,
  callbackUrl,
}: {
  provider: 'google-candidate' | 'google-recruiter';
  callbackUrl: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl })}
      className="btn-secondary w-full gap-2"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}
