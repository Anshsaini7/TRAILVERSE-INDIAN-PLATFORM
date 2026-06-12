import { MetadataRoute } from 'next';
import { treks } from '../data/mockData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trailverse.in';

  // Base core routes
  const routes = [
    '',
    '/explore',
    '/tracker',
    '/compare',
    '/cost-calculator',
    '/ai-planner',
    '/route-planner',
    '/community',
    '/auth',
    '/activities',
    '/admin',
    '/company-dashboard',
    '/dashboard',
    '/profile',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Trek routes
  const trekRoutes = treks.map((trek) => ({
    url: `${baseUrl}/trek/${trek.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...trekRoutes];
}
