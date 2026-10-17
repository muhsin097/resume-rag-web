import { auth } from '@/auth';

// Server-side helper: reads the NextAuth session, pulls out the Nest access
// token stashed there at login, and calls the Nest API with it as a Bearer
// token. Use this from Server Components / Route Handlers / Server Actions
// only -- it reads cookies via `auth()`, which needs the request context.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const session = await auth();

  const headers = new Headers(init.headers);
  // Leave Content-Type unset for FormData (file uploads) -- fetch sets the
  // multipart boundary itself, and overriding it here would break that.
  if (!(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  try {
    return await fetch(`${process.env.RESUME_API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    // A thrown fetch (not a 4xx/5xx response) means the API is actually
    // unreachable -- DNS failure, connection refused, timeout. Thrown with
    // this exact message; check it with isApiUnavailable() rather than
    // relying on an app/*/error.tsx boundary -- Next.js redacts the real
    // error.message in production builds before a boundary ever sees it,
    // so pages need to catch this themselves to show the friendly message.
    throw new Error('API_UNAVAILABLE');
  }
}

export function isApiUnavailable(error: unknown): boolean {
  return error instanceof Error && error.message === 'API_UNAVAILABLE';
}
