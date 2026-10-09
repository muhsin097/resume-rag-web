import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
