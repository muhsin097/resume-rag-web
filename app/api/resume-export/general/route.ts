import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

// Same proxy pattern as app/api/resume-export/[id]/route.ts, for the
// untailored "download my full profile as a resume" endpoint instead of a
// specific past generation.
export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format') === 'pdf' ? 'pdf' : 'docx';

  const response = await apiFetch(`/users/me/resume/export?format=${format}`);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    return NextResponse.json(data ?? { message: 'Could not export resume.' }, {
      status: response.status,
    });
  }

  const buffer = await response.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/octet-stream',
      'Content-Disposition':
        response.headers.get('Content-Disposition') ?? `attachment; filename="resume.${format}"`,
    },
  });
}
