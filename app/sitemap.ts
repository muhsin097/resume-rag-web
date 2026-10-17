import type { MetadataRoute } from 'next';

const SITE_URL = 'https://ceasetoresume.online';

// Only the genuinely public marketing/entry pages -- everything behind auth
// (dashboard, recruiter search/candidates) is excluded here and noindexed
// at the layout level too (see app/dashboard/layout.tsx).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/login`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/register`,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/recruiter/login`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/recruiter/register`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
