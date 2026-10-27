import type { MetadataRoute } from 'next';

const baseUrl = 'https://aitoolhunt-seven.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
