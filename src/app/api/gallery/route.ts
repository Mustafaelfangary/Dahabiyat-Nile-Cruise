import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get images from dahabiyat and packages
    const [dahabiyat, packages] = await Promise.all([
      prisma.dahabiya.findMany({
        select: {
          id: true,
          name: true,
          images: true,
        }
      }),
      prisma.package.findMany({
        select: {
          id: true,
          name: true,
        }
      })
    ]);

    const galleryImages: any[] = [];

    // Process dahabiya images
    dahabiyat.forEach(dahabiya => {
      if (dahabiya.images && Array.isArray(dahabiya.images)) {
        dahabiya.images.forEach((image: any, index: number) => {
          if (image && image.url && image.url.trim() !== '') {
            galleryImages.push({
              id: `dahabiya-${dahabiya.id}-${index}`,
              url: image.url,
              alt: image.alt || `${dahabiya.name} - Image ${index + 1}`,
              caption: `Beautiful view of ${dahabiya.name}`,
              category: 'dahabiya',
              itemName: dahabiya.name,
              itemSlug: dahabiya.id, // Use ID as slug fallback
              location: 'Nile River, Egypt',
              likes: Math.floor(Math.random() * 100) + 10,
              views: Math.floor(Math.random() * 1000) + 100,
            });
          }
        });
      }
    });

    // Process package images (skip for now as packages don't have direct images)
    // packages.forEach(pkg => {
    //   // Package images would be accessed through itineraryDays.images
    // });

    // Add some destination and experience images
    const additionalImages = [
      {
        id: 'dest-1',
        url: '/images/destinations/karnak-temple.jpg',
        alt: 'Karnak Temple Complex',
        caption: 'The magnificent Karnak Temple Complex in Luxor',
        category: 'destination',
        location: 'Luxor, Egypt',
        photographer: 'Ahmed Hassan',
        likes: 156,
        views: 3420,
      },
      {
        id: 'dest-2',
        url: '/images/destinations/valley-of-kings.jpg',
        alt: 'Valley of the Kings',
        caption: 'Ancient royal tombs in the Valley of the Kings',
        category: 'destination',
        location: 'Luxor, Egypt',
        photographer: 'Sarah Johnson',
        likes: 203,
        views: 4150,
      },
      {
        id: 'exp-1',
        url: '/images/experiences/sunset-sailing.jpg',
        alt: 'Sunset Sailing',
        caption: 'Magical sunset sailing on the Nile',
        category: 'experience',
        location: 'Nile River, Egypt',
        photographer: 'Mohamed Ali',
        likes: 89,
        views: 2100,
      },
      {
        id: 'exp-2',
        url: '/images/experiences/traditional-dinner.jpg',
        alt: 'Traditional Egyptian Dinner',
        caption: 'Authentic Egyptian cuisine on deck',
        category: 'experience',
        location: 'Dahabiya Deck',
        photographer: 'Fatima El-Sayed',
        likes: 67,
        views: 1580,
      },
    ];

    galleryImages.push(...additionalImages);

    // Sort by views (most popular first)
    galleryImages.sort((a, b) => b.views - a.views);

    return NextResponse.json({
      images: galleryImages,
      total: galleryImages.length,
      categories: {
        dahabiya: galleryImages.filter(img => img.category === 'dahabiya').length,
        package: galleryImages.filter(img => img.category === 'package').length,
        destination: galleryImages.filter(img => img.category === 'destination').length,
        experience: galleryImages.filter(img => img.category === 'experience').length,
      }
    });

  } catch (error) {
    console.error('Error fetching gallery:', error);
    
    // Return mock data if database fails
    const mockImages = [
      {
        id: 'mock-1',
        url: '/images/gallery/dahabiya-1.jpg',
        alt: 'Luxury Dahabiya',
        caption: 'Princess Cleopatra sailing on the Nile',
        category: 'dahabiya',
        itemName: 'Princess Cleopatra',
        itemSlug: 'princess-cleopatra',
        location: 'Nile River, Egypt',
        likes: 45,
        views: 1250
      },
      {
        id: 'mock-2',
        url: '/images/gallery/temple-1.jpg',
        alt: 'Ancient Temple',
        caption: 'Karnak Temple Complex',
        category: 'destination',
        location: 'Luxor, Egypt',
        photographer: 'Ahmed Hassan',
        likes: 67,
        views: 2100
      },
      {
        id: 'mock-3',
        url: '/images/gallery/sunset-1.jpg',
        alt: 'Nile Sunset',
        caption: 'Magical sunset on the Nile',
        category: 'experience',
        location: 'Nile River, Egypt',
        photographer: 'Sarah Johnson',
        likes: 89,
        views: 1800
      },
      {
        id: 'mock-4',
        url: '/images/gallery/package-1.jpg',
        alt: 'Cultural Discovery',
        caption: 'Cultural Discovery Journey highlights',
        category: 'package',
        itemName: 'Cultural Discovery',
        itemSlug: 'cultural-discovery',
        location: 'Egypt',
        likes: 34,
        views: 950
      }
    ];

    return NextResponse.json({
      images: mockImages,
      total: mockImages.length,
      categories: {
        dahabiya: 1,
        package: 1,
        destination: 1,
        experience: 1,
      }
    });
  }
}
