'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { searchCandidates, findBestFit, type BestFitCandidate } from './actions';

function scoreColorClass(score: number): string {
  if (score >= 80) {
    return 'bg-green-100 text-green-900 dark:bg-green-900/60 dark:text-green-200';
  }
  if (score >= 50) {
    return 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200';
  }
  return 'bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-200';
}

export function SearchForm({ initialCreditsRemaining }: { initialCreditsRemaining: number }) {
  const [query, setQuery] = useState('');
  const [creditsRemaining, setCreditsRemaining] = useState(initialCreditsRemaining);
  const [searchState, searchAction, isSearching] = useActionState(searchCandidates, {});

  const [bestFit, setBestFit] = useState<BestFitCandidate[] | null>(null);
  const [bestFitError, setBestFitError] = useState<string | null>(null);
  const [isRanking, setIsRanking] = useState(false);

  const results = searchState.results;
  const noCredits = creditsRemaining <= 0;

  // Plain client call to the server action rather than useActionState --
  // this one needs to react to its own result (decrement the credit
  // counter) rather than just rendering whatever state it produces.
  async function handleFindBestFit() {
    setIsRanking(true);
    setBestFitError(null);
    const formData = new FormData();
    formData.set('query', query);
    const result = await findBestFit({}, formData);
    setIsRanking(false);

    if (result.error) {
      setBestFitError(result.error);
      return;
    }
    setBestFit(result.results ?? null);
    setCreditsRemaining((n) => Math.max(0, n - 1));
  }

  return (
    <div className="space-y-6">
      <form action={searchAction} className="space-y-3">
        <label className="block space-y-1">
          <span className="text-sm muted">What are you looking for?</span>
          <textarea
            name="query"
            required
            minLength={10}
            rows={4}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setBestFit(null);
            }}
            placeholder="e.g. Senior backend engineer with Node.js and AWS experience..."
            className="input"
          />
        </label>
        <button type="submit" disabled={isSearching} className="btn-primary">
          {isSearching ? 'Searching...' : 'Search candidates'}
        </button>
        {searchState.error && <p className="text-sm text-red-600">{searchState.error}</p>}
      </form>

      {results && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="section-label">
              {searchState.totalCount}{' '}
              {searchState.totalCount === 1 ? 'candidate matches' : 'candidates match'}
            </p>
            {results.length > 0 && (
              <button
                type="button"
                onClick={handleFindBestFit}
                disabled={isRanking || noCredits}
                className="btn-secondary"
                title={noCredits ? 'No ranking credits remaining' : 'Costs 1 credit'}
              >
                {isRanking
                  ? 'Finding best fits...'
                  : noCredits
                    ? 'No credits remaining'
                    : `Find best 3 fits for this search (1 credit · ${creditsRemaining} left)`}
              </button>
            )}
          </div>

          {results.length === 0 && (
            <p className="text-sm muted">
              No candidates matched that search -- try broadening it.
            </p>
          )}

          {bestFitError && <p className="text-sm text-red-600">{bestFitError}</p>}

          {bestFit && (
            <div className="space-y-2">
              <p className="section-label">Best fits, ranked by AI analysis</p>
              {bestFit.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/recruiter/candidates/${candidate.id}`}
                  className="card block space-y-2 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-semibold ${scoreColorClass(candidate.matchScore)}`}
                    >
                      {candidate.matchScore}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{candidate.name}</span>
                        {candidate.location && (
                          <span className="text-sm muted">{candidate.location}</span>
                        )}
                      </div>
                      {candidate.bio && <p className="text-sm muted">{candidate.bio}</p>}
                    </div>
                  </div>
                  {(candidate.matchedKeywords.length > 0 ||
                    candidate.missingKeywords.length > 0) && (
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.matchedKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-900 dark:bg-green-900/60 dark:text-green-200"
                        >
                          {keyword}
                        </span>
                      ))}
                      {candidate.missingKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-900 dark:bg-red-900/60 dark:text-red-200"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {!bestFit && <p className="section-label">Preview</p>}
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/recruiter/candidates/${result.id}`}
                className="card block space-y-1 transition-colors hover:bg-[var(--surface-muted)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.name}</span>
                  {result.location && (
                    <span className="text-sm muted">{result.location}</span>
                  )}
                </div>
                <p className="text-sm muted">{result.matchSnippet}</p>
                {result.bio && <p className="text-sm">{result.bio}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
