import { NextRequest, NextResponse } from 'next/server';

// Same thin-proxy pattern as app/api/register/route.ts -- no session
// exists yet at this point, so this can't go through apiFetch.
export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${process.env.RESUME_API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
