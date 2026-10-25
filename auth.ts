import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

// Both Google providers below exchange a verified Google identity for our
// own JWT via this same backend call -- the only difference is which
// Nest endpoint (and therefore which persona's table) it hits.
//
// Forwards the actual Google ID token, not just the {email, name} NextAuth
// parsed out of it -- the backend now verifies that token itself
// (signature, audience, issuer, expiry, verified email) and derives
// email/name from ITS OWN verified payload, never from client-supplied
// fields. The old version just POSTed {email, name} with no proof at
// all: reproduced locally, a plain POST with any existing user's email
// returned a real access token, no Google involvement whatsoever.
async function exchangeGoogleProfileForToken(
  endpoint: '/auth/oauth' | '/recruiter-auth/oauth',
  idToken: string,
) {
  const response = await fetch(`${process.env.RESUME_API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    throw new Error('Could not complete Google sign-in.');
  }
  return response.json();
}

// NextAuth never talks to a database here -- it delegates credential
// checking entirely to the NestJS API, which owns the User table and the
// password hashing. The only thing NextAuth does is hold onto the access
// token NestJS hands back, inside its own (separately encrypted) session
// cookie, so the browser has somewhere to keep it between requests.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const response = await fetch(
          `${process.env.RESUME_API_BASE_URL}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          accessToken: data.accessToken,
          kind: 'candidate',
        };
      },
    }),
    // Same idea as the Google providers below -- the code itself (checked
    // server-side) is the proof of identity, not a password, so this
    // exchanges it for a session the same way a verified Google profile
    // does rather than going through the password-based provider above.
    Credentials({
      id: 'verify-email',
      credentials: {
        email: { label: 'Email' },
        code: { label: 'Code' },
      },
      authorize: async (credentials) => {
        const response = await fetch(
          `${process.env.RESUME_API_BASE_URL}/auth/verify-email`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              code: credentials?.code,
            }),
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          accessToken: data.accessToken,
          kind: 'candidate',
        };
      },
    }),
    // Second persona, same NextAuth config -- recruiters and candidates
    // share nothing except the login page's infrastructure. `id: 'recruiter'`
    // is what `signIn('recruiter', ...)` targets, and `kind` (carried through
    // below) is how every other page tells the two sessions apart.
    Credentials({
      id: 'recruiter',
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const response = await fetch(
          `${process.env.RESUME_API_BASE_URL}/recruiter-auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return {
          id: data.recruiter.id,
          email: data.recruiter.email,
          name: data.recruiter.name,
          accessToken: data.accessToken,
          kind: 'recruiter',
        };
      },
    }),
    // Mirrors the candidate 'verify-email' provider above -- recruiters
    // now go through the same OTP step before register() hands back a
    // real session (see recruiter-auth.service.ts).
    Credentials({
      id: 'recruiter-verify-email',
      credentials: {
        email: { label: 'Email' },
        code: { label: 'Code' },
      },
      authorize: async (credentials) => {
        const response = await fetch(
          `${process.env.RESUME_API_BASE_URL}/recruiter-auth/verify-email`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              code: credentials?.code,
            }),
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return {
          id: data.recruiter.id,
          email: data.recruiter.email,
          name: data.recruiter.name,
          accessToken: data.accessToken,
          kind: 'recruiter',
        };
      },
    }),
    Google({
      id: 'google-candidate',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (_profile, tokens) => {
        if (!tokens.id_token) {
          throw new Error('Google sign-in did not return an ID token.');
        }
        const data = await exchangeGoogleProfileForToken('/auth/oauth', tokens.id_token);
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          accessToken: data.accessToken,
          kind: 'candidate',
        };
      },
    }),
    Google({
      id: 'google-recruiter',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (_profile, tokens) => {
        if (!tokens.id_token) {
          throw new Error('Google sign-in did not return an ID token.');
        }
        const data = await exchangeGoogleProfileForToken('/recruiter-auth/oauth', tokens.id_token);
        return {
          id: data.recruiter.id,
          email: data.recruiter.email,
          name: data.recruiter.name,
          accessToken: data.accessToken,
          kind: 'recruiter',
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.kind = user.kind;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user.kind = token.kind as 'candidate' | 'recruiter';
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
