'use server';

import { apiFetch } from '@/lib/api';

export interface SearchCandidatesState {
  error?: string;
  results?: {
    id: string;
    name: string;
    bio: string | null;
    location: string | null;
    distance: number;
    matchSnippet: string;
  }[];
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

  return { results: data };
}
