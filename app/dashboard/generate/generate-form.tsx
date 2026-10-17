'use client';

import { useActionState } from 'react';
import { generateResume } from './actions';
import { highlightKeywords } from './highlight-keywords';
import { ResumePreview } from '../resume-preview';

function scoreColorClass(score: number): string {
  if (score >= 80) {
    return 'bg-green-100 text-green-900';
  }
  if (score >= 50) {
    return 'bg-amber-100 text-amber-900';
  }
  return 'bg-red-100 text-red-900';
}

export function GenerateForm() {
  const [state, formAction, isPending] = useActionState(generateResume, {});
  const generation = state.generation;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-3">
        <label className="block space-y-1">
          <span className="text-sm muted">Job description</span>
          <textarea
            name="jobDescription"
            required
            minLength={20}
            rows={8}
            placeholder="Paste the full job description here..."
            className="input"
          />
        </label>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Generating...' : 'Generate tailored resume'}
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </form>

      {generation && (
        <div className="space-y-4">
          <div className="card flex flex-wrap items-center gap-4">
            <div
              className={`flex h-16 w-16 flex-none items-center justify-center rounded-full text-lg font-semibold ${scoreColorClass(generation.matchScore)}`}
            >
              {generation.matchScore}
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">Match score out of 100</p>
              <p className="muted">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500 align-middle" />
                matched in the resume
                <span className="mx-2">&middot;</span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" />
                missing from the resume
              </p>
              {generation.missingKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {generation.missingKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-900"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="card">
              <h2 className="mb-2 font-semibold">Job description</h2>
              <p className="whitespace-pre-wrap text-sm">
                {highlightKeywords(
                  generation.jobDescription,
                  generation.matchedKeywords,
                  generation.missingKeywords,
                )}
              </p>
            </div>

            <div className="card">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-semibold">Tailored resume</h2>
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(generation.generatedContent)
                    }
                    className="link"
                  >
                    Copy
                  </button>
                  {generation.structuredContent && (
                    <>
                      <a
                        href={`/api/resume-export/${generation.id}?format=docx`}
                        className="link"
                      >
                        DOCX
                      </a>
                      <a
                        href={`/api/resume-export/${generation.id}?format=pdf`}
                        className="link"
                      >
                        PDF
                      </a>
                    </>
                  )}
                </div>
              </div>
              {generation.structuredContent ? (
                <ResumePreview resume={generation.structuredContent} />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {generation.generatedContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
