import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://trailverse.in';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/company-dashboard/', '/profile/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
