import { NextRequest, NextResponse } from 'next/server';

// Thin proxy so the browser never needs to know RESUME_API_BASE_URL directly,
// and so the register page can reuse the same "fetch my own API" pattern
// every other page will use once a session exists.
export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(
    `${process.env.RESUME_API_BASE_URL}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
