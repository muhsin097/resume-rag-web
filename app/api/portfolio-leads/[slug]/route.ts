import { NextRequest, NextResponse } from 'next/server';

// Same proxy pattern as /api/register -- the browser never talks to the
// Nest API directly. No session/auth involved here at all: this forwards
// a public, unauthenticated visitor submission to the public, rate-
// limited POST /portfolio/:slug/leads endpoint, server-to-server.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await request.json();

  const response = await fetch(
    `${process.env.RESUME_API_BASE_URL}/portfolio/${encodeURIComponent(slug)}/leads`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
