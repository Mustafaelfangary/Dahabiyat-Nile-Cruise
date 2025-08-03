import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cleopatra-dahabiyat.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dahabiyat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    // Test database connection first
    await prisma.$connect();

    // Dynamic dahabiya pages
    const dahabiyas = await prisma.dahabiya.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const dahabiyaPages: MetadataRoute.Sitemap = dahabiyas.map((dahabiya) => ({
      url: `${baseUrl}/dahabiyas/${dahabiya.slug}`,
      lastModified: dahabiya.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Static package pages removed - now using dynamic package generation
    const staticPackagePages: MetadataRoute.Sitemap = [];

    return [...staticPages, ...dahabiyaPages, ...staticPackagePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return only static pages if database query fails
    return staticPages;
  }
}
