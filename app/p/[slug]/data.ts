import { cacheLife, cacheTag } from 'next/cache';
import { portfolioCacheTag } from './cache-tag';

export interface PortfolioSkill {
  title: string;
  category: string | null;
  evidenceCount: number;
  roles: string[];
}

export interface PortfolioExperienceItem {
  id: string;
  title: string;
  organization: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
}

export interface PortfolioProfile {
  name: string;
  bio: string | null;
  location: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  skills: PortfolioSkill[];
  experience: PortfolioExperienceItem[];
  projects: PortfolioExperienceItem[];
  education: PortfolioExperienceItem[];
  certifications: PortfolioExperienceItem[];
  languages: { title: string }[];
  achievements: { title: string; description: string | null }[];
}

// 'use cache' functions can't touch request-time APIs (cookies/headers),
// which rules out lib/api.ts's apiFetch (it calls auth(), which reads the
// session cookie) -- not a problem here, since this endpoint is public
// and was never going to send a session token anyway. Plain fetch
// straight to the API.
//
// cacheLife('hours'): auto-revalidates in the background roughly hourly
// even if nothing explicitly invalidates it. On-demand invalidation
// (immediate, not waiting on that hour) happens via updateTag from the
// profile-editing actions and the enable/disable toggle -- see
// dashboard/profile/actions.ts.
export async function getPortfolioData(slug: string): Promise<PortfolioProfile | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(portfolioCacheTag(slug));

  const res = await fetch(`${process.env.RESUME_API_BASE_URL}/portfolio/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  return res.json() as Promise<PortfolioProfile>;
}
