'use client';

import { useActionState, useState, useTransition } from 'react';
import { generateResume, addSkillsToResume, rescoreResume, type Generation } from './actions';
import { highlightKeywords } from './highlight-keywords';
import { MissingKeywordsPanel, type StagedSkill } from './missing-keywords-panel';
import Link from 'next/link';
import { ResumePreview } from '../resume-preview';
import { FullPageLoader } from '../../components/full-page-loader';

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
  const [state, formAction, isGenerating] = useActionState(generateResume, {});

  // Local copy of the current generation, separate from useActionState's
  // own state -- addSkillToResume/rescoreResume aren't form submissions,
  // they're plain server-action calls that need to update the same
  // generation in place without re-running the (expensive, credited)
  // generate flow.
  const [generation, setGeneration] = useState<Generation | undefined>(state.generation);
  const [recentlyAddedSkills, setRecentlyAddedSkills] = useState<string[]>([]);
  // True once a skill has been added since the last score calculation --
  // the Skills section is already updated, but fitScore/keywordCoverage
  // still reflect the resume as it was before that addition.
  const [scoreIsStale, setScoreIsStale] = useState(false);
  const [addSkillsError, setAddSkillsError] = useState<string | null>(null);
  const [rescoreError, setRescoreError] = useState<string | null>(null);
  const [isAddingSkills, startAddingSkills] = useTransition();
  const [isRescoring, startRescoring] = useTransition();
  const [prevStateGeneration, setPrevStateGeneration] = useState(state.generation);

  // state.generation only changes when a fresh generateResume() submission
  // completes -- reset the local working copy then. Compared during
  // render rather than in an effect so this doesn't cost an extra render
  // before the UI reflects the new generation.
  if (state.generation !== prevStateGeneration) {
    setPrevStateGeneration(state.generation);
    if (state.generation) {
      setGeneration(state.generation);
      setRecentlyAddedSkills([]);
      setScoreIsStale(false);
      setAddSkillsError(null);
      setRescoreError(null);
    }
  }

  function handleAddKeywords(skills: StagedSkill[]) {
    if (!generation) return;
    setAddSkillsError(null);
    startAddingSkills(async () => {
      // One request for the whole batch -- not one per skill. The
      // backend batches the Voyage embed + Claude categorize calls for
      // everything being saved to the profile, so this can't trip
      // Voyage's per-minute rate limit the way looping used to.
      const result = await addSkillsToResume(generation.id, skills);
      if (result.error) {
        setAddSkillsError(result.error);
        return;
      }
      if (result.generation) setGeneration(result.generation);
      setRecentlyAddedSkills((prev) => [...prev, ...skills.map((s) => s.keyword)]);
      setScoreIsStale(true);
    });
  }

  function handleRescore() {
    if (!generation) return;
    setRescoreError(null);
    startRescoring(async () => {
      const result = await rescoreResume(generation.id);
      if (result.error) {
        setRescoreError(result.error);
        return;
      }
      if (result.generation) {
        setGeneration(result.generation);
        setScoreIsStale(false);
      }
    });
  }

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
        <button type="submit" disabled={isGenerating} className="btn-primary">
          {isGenerating ? 'Generating...' : 'Generate tailored resume'}
        </button>
        {state.error && (
          <p className="text-sm text-red-600">
            {state.error}
            {state.error.includes('generation credits') && (
              <>
                {' '}
                <Link href="/dashboard/buy-credits" className="link">
                  Buy more
                </Link>
              </>
            )}
          </p>
        )}
      </form>

      {isGenerating && (
        <FullPageLoader label="Reading your profile and tailoring your resume..." />
      )}

      {!isGenerating && generation && (
        <div className="space-y-4">
          {recentlyAddedSkills.length > 0 && (
            <div className="card-muted text-sm text-green-900">
              Added to your resume: {recentlyAddedSkills.join(', ')}
            </div>
          )}
          <div className="card flex flex-wrap items-center gap-4">
            <div className="flex flex-none items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold ${scoreColorClass(generation.keywordCoverage)} ${scoreIsStale ? 'opacity-50' : ''}`}
                >
                  {generation.keywordCoverage}
                </div>
                <span className="text-xs muted">Keyword coverage</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold ${scoreColorClass(generation.fitScore)} ${scoreIsStale ? 'opacity-50' : ''}`}
                >
                  {generation.fitScore}
                </div>
                <span className="text-xs muted">Overall fit</span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-1 text-sm">
              <p className="font-medium">
                Keyword coverage is how many of the job&apos;s key terms your resume matches.
                Overall fit is Claude&apos;s broader read of how well your background fits the
                role, beyond just those terms.
              </p>
              <p className="muted">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500 align-middle" />
                matched in the resume
                <span className="mx-2">&middot;</span>
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500 align-middle" />
                missing from the resume
              </p>
              {scoreIsStale && (
                <div className="card-muted flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
                  <span>Scores above don&apos;t reflect the skills you just added yet.</span>
                  <button
                    type="button"
                    onClick={handleRescore}
                    disabled={isRescoring}
                    className="btn-primary px-3 py-1 text-xs"
                  >
                    {isRescoring ? 'Recalculating...' : 'Recalculate score (1 credit)'}
                  </button>
                </div>
              )}
              {rescoreError && <p className="text-xs text-red-600">{rescoreError}</p>}
              {addSkillsError && <p className="text-xs text-red-600">{addSkillsError}</p>}
              {generation.missingKeywords.length > 0 && (
                <MissingKeywordsPanel
                  key={generation.id}
                  missingKeywords={generation.missingKeywords}
                  onSubmit={handleAddKeywords}
                  pending={isAddingSkills}
                />
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
                <ResumePreview
                  resume={generation.structuredContent}
                  highlightedSkills={recentlyAddedSkills}
                />
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
