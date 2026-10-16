import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/recruiter/search', '/recruiter/candidates/', '/api/'],
    },
    sitemap: 'https://ceasetoresume.online/sitemap.xml',
  };
}
