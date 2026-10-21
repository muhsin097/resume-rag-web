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

export interface KeywordResult {
  keyword: string;
  normalizedTitle: string;
  approved: boolean;
}

export interface GenerateResumeState {
  error?: string;
  generation?: {
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
    // Only present on a response to a request that included requestedSkills
    // -- feedback on what happened to each one, not a stored fact of the
    // generation itself.
    keywordResults?: KeywordResult[];
  };
}

// Signature matches React's useActionState (prevState, formData) -- the
// client form below passes this straight in as its action.
export async function generateResume(
  _prevState: GenerateResumeState,
  formData: FormData,
): Promise<GenerateResumeState> {
  const jobDescription = String(formData.get('jobDescription') ?? '');
  const requestedSkillsRaw = formData.get('requestedSkills');
  const requestedSkills = requestedSkillsRaw
    ? (JSON.parse(String(requestedSkillsRaw)) as { keyword: string; saveToProfile: boolean }[])
    : undefined;

  const response = await apiFetch('/resume-generations', {
    method: 'POST',
    body: JSON.stringify({ jobDescription, requestedSkills }),
  });

  const data = await response.json();
  if (!response.ok) {
    return { error: data?.message ?? 'Could not generate resume.' };
  }

  return { generation: data };
}
