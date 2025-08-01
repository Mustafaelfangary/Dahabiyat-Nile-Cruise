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
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Dynamic package pages - commented out since Package model doesn't have slug field
    // const packages = await prisma.package.findMany({
    //   select: {
    //     id: true,
    //     updatedAt: true,
    //   },
    // });

    // const packagePages: MetadataRoute.Sitemap = packages.map((pkg) => ({
    //   url: `${baseUrl}/packages/${pkg.id}`,
    //   lastModified: pkg.updatedAt,
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // }));

    const packagePages: MetadataRoute.Sitemap = [];

    return [...staticPages, ...dahabiyaPages, ...packagePages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if database query fails
    return staticPages;
  }
}
