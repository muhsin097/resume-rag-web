import { NextRequest, NextResponse } from 'next/server';

// Same thin-proxy pattern as /api/register -- keeps RESUME_API_BASE_URL out
// of the browser and lets the recruiter register page use a plain fetch
// before any session exists.
export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(
    `${process.env.RESUME_API_BASE_URL}/recruiter-auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
