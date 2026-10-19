import { NextRequest, NextResponse } from 'next/server';

// NextAuth's Credentials authorize() collapses every failure into the
// same generic "CredentialsSignin" error, so the login page can't tell
// "wrong password" apart from "needs email verification" from the
// response of signIn() alone. This hits /auth/login directly first (same
// request signIn's own authorize() will make a moment later on success --
// a small redundant call, only on the login path, in exchange for being
// able to show the real reason) to get the actual status/message, then
// the page calls signIn() separately to establish the real session.
export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${process.env.RESUME_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(
    { message: data?.message },
    { status: response.status },
  );
}
