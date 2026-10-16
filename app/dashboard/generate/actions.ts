'use server';

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

export interface GenerateResumeState {
  error?: string;
  generation?: {
    id: string;
    jobDescription: string;
    generatedContent: string;
    structuredContent: StructuredResume | null;
    matchScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    createdAt: string;
  };
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

  return { generation: data };
}
