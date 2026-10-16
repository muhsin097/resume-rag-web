import { apiFetch } from '@/lib/api';
import { RegenerateButton } from './regenerate-button';
import { ResumePreview } from '../resume-preview';
import type { StructuredResume } from '../generate/actions';

export const instant = false;

interface ResumeGeneration {
  id: string;
  jobDescription: string;
  generatedContent: string;
  structuredContent: StructuredResume | null;
  matchScore: number;
  createdAt: string;
}

function scoreColorClass(score: number): string {
  if (score >= 80) {
    return 'bg-green-100 text-green-900 dark:bg-green-900/60 dark:text-green-200';
  }
  if (score >= 50) {
    return 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200';
  }
  return 'bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-200';
}

export default async function HistoryPage() {
  const res = await apiFetch('/resume-generations');
  const generations: ResumeGeneration[] = await res.json();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-lg font-semibold">Generation history</h1>

      {generations.length === 0 && (
        <p className="text-sm muted">
          No generations yet -- head to Generate to create your first tailored
          resume.
        </p>
      )}

      {generations.map((generation) => (
        <details key={generation.id} className="card">
          <summary className="flex cursor-pointer items-center gap-3 text-sm">
            <span
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-semibold ${scoreColorClass(generation.matchScore)}`}
            >
              {generation.matchScore}
            </span>
            <span>
              {new Date(generation.createdAt).toLocaleString()} &middot;{' '}
              {generation.jobDescription.slice(0, 80)}
              {generation.jobDescription.length > 80 ? '...' : ''}
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
      ))}
    </div>
  );
}
