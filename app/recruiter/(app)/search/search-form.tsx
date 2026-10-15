'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { searchCandidates } from './actions';

export function SearchForm() {
  const [state, formAction, isPending] = useActionState(searchCandidates, {});
  const results = state.results;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-3">
        <label className="block space-y-1">
          <span className="text-sm muted">What are you looking for?</span>
          <textarea
            name="query"
            required
            minLength={10}
            rows={4}
            placeholder="e.g. Senior backend engineer with Node.js and AWS experience..."
            className="input"
          />
        </label>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Searching...' : 'Search candidates'}
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </form>

      {results && (
        <div className="space-y-3">
          <p className="section-label">
            {results.length} {results.length === 1 ? 'match' : 'matches'}
          </p>
          {results.length === 0 && (
            <p className="text-sm muted">
              No candidates matched that search -- try broadening it.
            </p>
          )}
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
              {result.bio && (
                <p className="text-sm">{result.bio}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
