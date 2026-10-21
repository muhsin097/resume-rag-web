'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api';

export interface RegenerateState {
  error?: string;
  success?: boolean;
}

// Same shape as generateResume in dashboard/generate/actions.ts -- this
// IS that same POST /resume-generations call, just fed a stored job
// description instead of a freshly-typed one. Gated by the same credit
// reservation the service already does; no separate check needed here.
export async function regenerateResumeGeneration(
  _prevState: RegenerateState,
  formData: FormData,
): Promise<RegenerateState> {
  const jobDescription = String(formData.get('jobDescription') ?? '');

  const response = await apiFetch('/resume-generations', {
    method: 'POST',
    body: JSON.stringify({ jobDescription }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    return { error: data?.message ?? 'Could not regenerate.' };
  }

  revalidatePath('/dashboard/history');
  return { success: true };
}
