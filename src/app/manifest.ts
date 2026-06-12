import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TrailVerse India',
    short_name: 'TrailVerse',
    description: 'Premium High-Altitude Adventure Travel & Trekking Ecosystem',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1120',
    theme_color: '#14532D',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/next.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
  };
}
