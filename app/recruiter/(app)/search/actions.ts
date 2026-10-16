'use server';

import { apiFetch } from '@/lib/api';

export interface CandidatePreview {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  matchSnippet: string;
}

export interface SearchCandidatesState {
  error?: string;
  totalCount?: number;
  results?: CandidatePreview[];
}

// Signature matches React's useActionState (prevState, formData) -- same
// shape as generateResume in dashboard/generate/actions.ts.
export async function searchCandidates(
  _prevState: SearchCandidatesState,
  formData: FormData,
): Promise<SearchCandidatesState> {
  const query = String(formData.get('query') ?? '');

  const response = await apiFetch('/recruiter/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data?.message ?? 'Could not run that search.' };
  }

  return { totalCount: data.totalCount, results: data.results };
}

export interface BestFitCandidate {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface FindBestFitState {
  error?: string;
  results?: BestFitCandidate[];
}

// Credit-gated -- the query comes along as a hidden field on the same form
// rather than being re-typed, so "find best fit" acts on whatever was just
// searched for.
export async function findBestFit(
  _prevState: FindBestFitState,
  formData: FormData,
): Promise<FindBestFitState> {
  const query = String(formData.get('query') ?? '');

  const response = await apiFetch('/recruiter/search/best-fit', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data?.message ?? 'Could not run that search.' };
  }

  return { results: data };
}
