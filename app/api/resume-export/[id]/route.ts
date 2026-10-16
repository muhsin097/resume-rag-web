import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

// The export endpoint is JwtAuthGuard-protected on the Nest side, and a
// plain <a href> browser navigation can't carry a Bearer token the way
// apiFetch does server-side -- so downloads go through this same-origin
// proxy (cookie-authenticated via the NextAuth session already on the
// page) instead of linking directly at RESUME_API_BASE_URL.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const format = request.nextUrl.searchParams.get('format') === 'pdf' ? 'pdf' : 'docx';

  const response = await apiFetch(`/resume-generations/${id}/export?format=${format}`);
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
