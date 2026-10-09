import type { DefaultSession } from 'next-auth';

// Module augmentation: NextAuth's own session/JWT are just for the browser
// cookie. We piggyback the Nest-issued access token on top of them so the
// frontend has one place (`session.accessToken`) to read the token it must
// send to the NestJS API.
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: DefaultSession['user'] & { id: string };
  }

  interface User {
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id?: string;
  }
}
