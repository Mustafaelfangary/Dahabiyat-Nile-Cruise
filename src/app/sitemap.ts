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

    // Add static package pages since dynamic ones are commented out
    const staticPackagePages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/packages/luxury-nile-experience`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/packages/classic-egypt-explorer`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/packages/cultural-discovery`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/packages/adventure-explorer`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/packages/royal-heritage`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/packages/family-heritage`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];

    return [...staticPages, ...dahabiyaPages, ...staticPackagePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return static pages with fallback package pages if database query fails
    const fallbackPackagePages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/packages/luxury-nile-experience`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/packages/classic-egypt-explorer`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/packages/cultural-discovery`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
    ];

    return [...staticPages, ...fallbackPackagePages];
  }
}
