import Link from 'next/link';
import { apiFetch, isApiUnavailable } from '@/lib/api';
import { ApiDownMessage } from '../../components/api-down';
import { RegenerateButton } from './regenerate-button';
import { ResumePreview } from '../resume-preview';
import type { StructuredResume } from '../generate/actions';

export const instant = false;

const PAGE_SIZE = 10;

interface ResumeGeneration {
  id: string;
  jobDescription: string;
  jobTitle: string | null;
  companyName: string | null;
  generatedContent: string;
  structuredContent: StructuredResume | null;
  matchScore: number;
  createdAt: string;
}

interface PaginatedGenerations {
  items: ResumeGeneration[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function scoreColorClass(score: number): string {
  if (score >= 80) {
    return 'bg-green-100 text-green-900';
  }
  if (score >= 50) {
    return 'bg-amber-100 text-amber-900';
  }
  return 'bg-red-100 text-red-900';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// First ~140 characters of the JD, whitespace collapsed -- a one-line
// preview under the title so there's always something recognizable to
// scan, even when jobTitle/companyName weren't clearly stated in the
// posting and fell back to null.
function briefFromJobDescription(jobDescription: string): string {
  const collapsed = jobDescription.replace(/\s+/g, ' ').trim();
  return collapsed.length > 140 ? `${collapsed.slice(0, 140)}...` : collapsed;
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let res;
  try {
    res = await apiFetch(`/resume-generations?page=${page}&limit=${PAGE_SIZE}`);
  } catch (err) {
    if (isApiUnavailable(err)) return <ApiDownMessage />;
    throw err;
  }
  const data: PaginatedGenerations = await res.json();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-lg font-semibold">Generation history</h1>
        {data.total > 0 && (
          <p className="text-sm muted">
            {data.total} generation{data.total === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {data.items.length === 0 && (
        <p className="text-sm muted">
          No generations yet -- head to Generate to create your first tailored
          resume.
        </p>
      )}

      {data.items.map((generation) => {
        const heading = generation.jobTitle
          ? generation.companyName
            ? `${generation.jobTitle} at ${generation.companyName}`
            : generation.jobTitle
          : generation.companyName
            ? `Role at ${generation.companyName}`
            : briefFromJobDescription(generation.jobDescription);

        return (
          <details key={generation.id} className="card">
            <summary className="flex cursor-pointer items-start gap-3 text-sm">
              <span
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-semibold ${scoreColorClass(generation.matchScore)}`}
              >
                {generation.matchScore}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{heading}</span>
                <span className="block text-xs muted">{formatDate(generation.createdAt)}</span>
                {generation.jobTitle || generation.companyName ? (
                  <span className="mt-0.5 block text-xs muted">
                    {briefFromJobDescription(generation.jobDescription)}
                  </span>
                ) : null}
              </span>
            </summary>
            <div className="mt-2 flex items-center gap-3">
              <RegenerateButton jobDescription={generation.jobDescription} />
              {generation.structuredContent && (
                <>
                  <a
                    href={`/api/resume-export/${generation.id}?format=docx`}
                    className="link text-xs"
                  >
                    Download DOCX
                  </a>
                  <a
                    href={`/api/resume-export/${generation.id}?format=pdf`}
                    className="link text-xs"
                  >
                    Download PDF
                  </a>
                </>
              )}
            </div>
            {generation.structuredContent ? (
              <div className="mt-3">
                <ResumePreview resume={generation.structuredContent} />
              </div>
            ) : (
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm">
                {generation.generatedContent}
              </pre>
            )}
          </details>
        );
      })}

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-sm">
          {page > 1 ? (
            <Link href={`/dashboard/history?page=${page - 1}`} className="link">
              &larr; Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="muted">
            Page {data.page} of {data.totalPages}
          </span>
          {page < data.totalPages ? (
            <Link href={`/dashboard/history?page=${page + 1}`} className="link">
              Older &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
