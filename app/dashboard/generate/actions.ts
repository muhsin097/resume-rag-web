'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api';

export interface ResumeSection {
  heading: string;
  items: {
    title: string;
    subtitle: string | null;
    bullets: string[];
  }[];
}

export interface StructuredResume {
  name: string;
  title: string | null;
  contactLine: string;
  summary: string | null;
  sections: ResumeSection[];
}

export interface Generation {
  id: string;
  jobDescription: string;
  generatedContent: string;
  structuredContent: StructuredResume | null;
  // Two deliberately separate signals -- see generate-form.tsx for how
  // they're displayed. fitScore is Claude's holistic judgment of overall
  // candidate fit; keywordCoverage is a deterministic percentage of the
  // JD's keywords this resume matches.
  fitScore: number;
  keywordCoverage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  createdAt: string;
}

export interface GenerateResumeState {
  error?: string;
  generation?: Generation;
}

// Signature matches React's useActionState (prevState, formData) -- the
// client form below passes this straight in as its action.
export async function generateResume(
  _prevState: GenerateResumeState,
  formData: FormData,
): Promise<GenerateResumeState> {
  const jobDescription = String(formData.get('jobDescription') ?? '');

  const response = await apiFetch('/resume-generations', {
    method: 'POST',
    body: JSON.stringify({ jobDescription }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data?.message ?? 'Could not generate resume.' };
  }

  // A successful generation always decrements creditsBalance server-side
  // (see reserveGenerationCredit) -- without this, both this page's "N
  // remaining" card and the credits badge in dashboard/layout.tsx (a
  // server component, same as this one) keep rendering the stale balance
  // from whenever they last loaded. 'layout' revalidates the shared
  // dashboard layout the badge lives in, not just this page.
  revalidatePath('/dashboard', 'layout');

  return { generation: data };
}

export interface AddSkillState {
  error?: string;
  generation?: Generation;
}

// Free -- no LLM call, no credit charge (see
// ResumeGenerationsService.addSkillToGeneration). Only the Skills section
// and generatedContent change; fitScore/keywordCoverage are left exactly
// as they were until the caller explicitly runs rescoreResume.
export async function addSkillToResume(
  generationId: string,
  keyword: string,
  saveToProfile: boolean,
): Promise<AddSkillState> {
  const response = await apiFetch(`/resume-generations/${generationId}/skills`, {
    method: 'POST',
    body: JSON.stringify({ keyword, saveToProfile }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data?.message ?? 'Could not add skill.' };
  }

  // No credits spent, but the Skills section (and anyone else viewing
  // this generation, e.g. History) should see the update.
  revalidatePath('/dashboard/history');

  return { generation: data };
}

export interface RescoreState {
  error?: string;
  generation?: Generation;
}

// 1 credit -- reruns only analyzeMatch against the generation's current
// content, never the bullet-writing call (bullets can't be affected by a
// Skills-only change).
export async function rescoreResume(generationId: string): Promise<RescoreState> {
  const response = await apiFetch(`/resume-generations/${generationId}/rescore`, {
    method: 'POST',
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data?.message ?? 'Could not recalculate score.' };
  }

  revalidatePath('/dashboard', 'layout');

  return { generation: data };
}
