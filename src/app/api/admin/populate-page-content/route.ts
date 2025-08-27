import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('🚀 Starting to populate missing page content...');

    // Define comprehensive content for all main pages
    const pageContent = [
      // DAHABIYAS PAGE CONTENT
      {
        key: 'dahabiyas_hero_title',
        title: 'Dahabiyas Hero Title',
        content: 'Traditional Dahabiyas',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'hero',
        order: 1
      },
      {
        key: 'dahabiyas_hero_subtitle',
        title: 'Dahabiyas Hero Subtitle',
        content: 'Sail the Nile in Authentic Traditional Boats',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'hero',
        order: 2
      },
      {
        key: 'dahabiyas_hero_description',
        title: 'Dahabiyas Hero Description',
        content: 'Experience the timeless beauty of the Nile aboard our carefully selected traditional dahabiyas. Each vessel combines authentic Egyptian craftsmanship with modern comfort, offering an intimate and luxurious journey through ancient Egypt.',
        contentType: 'TEXTAREA',
        page: 'dahabiyas',
        section: 'hero',
        order: 3
      },
      {
        key: 'dahabiyas_page_title',
        title: 'Dahabiyas Page Title',
        content: 'Our Fleet of Traditional Dahabiyas',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'main',
        order: 1
      },
      {
        key: 'dahabiyas_cta_packages_title',
        title: 'Dahabiyas CTA Packages Title',
        content: 'Explore Packages',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'cta',
        order: 1
      },
      {
        key: 'dahabiyas_cta_packages_subtitle',
        title: 'Dahabiyas CTA Packages Subtitle',
        content: 'Complete journey experiences',
        contentType: 'TEXT',
        page: 'dahabiyas',
        section: 'cta',
        order: 2
      },

      // PACKAGES PAGE CONTENT
      {
        key: 'packages_hero_title',
        title: 'Packages Hero Title',
        content: 'Luxury Nile Cruise Packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'hero',
        order: 1
      },
      {
        key: 'packages_hero_subtitle',
        title: 'Packages Hero Subtitle',
        content: 'Curated Experiences for Every Type of Traveler',
        contentType: 'TEXT',
        page: 'packages',
        section: 'hero',
        order: 2
      },
      {
        key: 'packages_hero_description',
        title: 'Packages Hero Description',
        content: 'Discover our carefully crafted cruise packages, each designed to offer you the perfect blend of adventure, culture, and luxury. From intimate journeys to grand expeditions, find the perfect way to explore ancient Egypt.',
        contentType: 'TEXTAREA',
        page: 'packages',
        section: 'hero',
        order: 3
      },
      {
        key: 'packages_featured_title',
        title: 'Featured Packages Title',
        content: 'Featured Packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'featured',
        order: 1
      },
      {
        key: 'packages_all_title',
        title: 'All Packages Title',
        content: 'All Available Packages',
        contentType: 'TEXT',
        page: 'packages',
        section: 'main',
        order: 1
      },

      // ITINERARIES PAGE CONTENT
      {
        key: 'itineraries_hero_title',
        title: 'Itineraries Hero Title',
        content: 'Discover Ancient Egypt',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'hero',
        order: 1
      },
      {
        key: 'itineraries_hero_subtitle',
        title: 'Itineraries Hero Subtitle',
        content: 'Journey Through Time on the Eternal Nile',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'hero',
        order: 2
      },
      {
        key: 'itineraries_hero_description',
        title: 'Itineraries Hero Description',
        content: 'Explore our carefully crafted itineraries that take you through 5000 years of Egyptian history. Each journey is designed to immerse you in the wonders of ancient civilization while enjoying modern luxury aboard our traditional dahabiyas.',
        contentType: 'TEXTAREA',
        page: 'itineraries',
        section: 'hero',
        order: 3
      },
      {
        key: 'itineraries_featured_title',
        title: 'Featured Itineraries Title',
        content: 'Popular Routes',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'featured',
        order: 1
      },
      {
        key: 'itineraries_all_title',
        title: 'All Itineraries Title',
        content: 'All Available Routes',
        contentType: 'TEXT',
        page: 'itineraries',
        section: 'main',
        order: 1
      },

      // BLOG PAGE CONTENT
      {
        key: 'blog_hero_title',
        title: 'Blog Hero Title',
        content: 'Stories from the Nile',
        contentType: 'TEXT',
        page: 'blog',
        section: 'hero',
        order: 1
      },
      {
        key: 'blog_hero_subtitle',
        title: 'Blog Hero Subtitle',
        content: 'Discover Egypt Through Our Eyes',
        contentType: 'TEXT',
        page: 'blog',
        section: 'hero',
        order: 2
      },
      {
        key: 'blog_hero_description',
        title: 'Blog Hero Description',
        content: 'Explore ancient mysteries, travel tips, cultural insights, and inspiring stories from fellow travelers who have experienced the magic of Egypt. Join us on a journey of discovery through words and images.',
        contentType: 'TEXTAREA',
        page: 'blog',
        section: 'hero',
        order: 3
      },
      {
        key: 'blog_featured_title',
        title: 'Featured Posts Title',
        content: 'Featured Stories',
        contentType: 'TEXT',
        page: 'blog',
        section: 'featured',
        order: 1
      },
      {
        key: 'blog_recent_title',
        title: 'Recent Posts Title',
        content: 'Latest Articles',
        contentType: 'TEXT',
        page: 'blog',
        section: 'recent',
        order: 1
      },
      {
        key: 'blog_categories_title',
        title: 'Categories Title',
        content: 'Explore by Category',
        contentType: 'TEXT',
        page: 'blog',
        section: 'categories',
        order: 1
      }
    ];

    let created = 0;
    let updated = 0;

    for (const content of pageContent) {
      try {
        const result = await prisma.websiteContent.upsert({
          where: { key: content.key },
          update: {
            title: content.title,
            content: content.content,
            contentType: content.contentType as any,
            page: content.page,
            section: content.section,
            order: content.order,
            isActive: true
          },
          create: {
            key: content.key,
            title: content.title,
            content: content.content,
            contentType: content.contentType as any,
            page: content.page,
            section: content.section,
            order: content.order,
            isActive: true
          }
        });

        if (result.createdAt === result.updatedAt) {
          created++;
        } else {
          updated++;
        }

        console.log(`✅ ${content.page}: ${content.key}`);
      } catch (error) {
        console.error(`❌ Failed to create ${content.key}:`, error);
      }
    }

    console.log(`\n📊 CONTENT POPULATION SUMMARY:`);
    console.log(`✅ Created: ${created} new content items`);
    console.log(`🔄 Updated: ${updated} existing content items`);
    console.log(`📄 Total processed: ${pageContent.length} items`);

    return NextResponse.json({
      success: true,
      message: 'Page content populated successfully',
      stats: {
        created,
        updated,
        total: pageContent.length
      }
    });

  } catch (error) {
    console.error('❌ Error populating page content:', error);
    return NextResponse.json(
      { error: 'Failed to populate page content' },
      { status: 500 }
    );
  }
}
