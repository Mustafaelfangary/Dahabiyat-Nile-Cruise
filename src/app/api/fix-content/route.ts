import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Define the missing content keys that are causing warnings
    const missingContent = [
      {
        key: 'navbar_logo',
        content: '/images/logo.png',
        title: 'Navigation Logo',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'navigation',
        isActive: true
      },
      {
        key: 'site_name',
        content: 'Dahabiyat Nile Cruise',
        title: 'Site Name',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'global',
        isActive: true
      },
      {
        key: 'footer_logo',
        content: '/images/logo.png',
        title: 'Footer Logo',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'footer',
        isActive: true
      },
      {
        key: 'footer_loading_text',
        content: 'Loading Royal Footer...',
        title: 'Footer Loading Text',
        contentType: 'TEXT',
        page: 'footer',
        section: 'loading',
        isActive: true
      },
      {
        key: 'footer_developer_logo',
        content: '/images/logo-white.png',
        title: 'Developer Logo',
        contentType: 'IMAGE',
        page: 'footer',
        section: 'developer',
        isActive: true
      },
      {
        key: 'footer_developer_contact_text',
        content: 'Crafted with love in the land of the Pharaohs by Just X Development',
        title: 'Developer Contact Text',
        contentType: 'TEXT',
        page: 'footer',
        section: 'developer',
        isActive: true
      }
    ];

    let created = 0;
    let updated = 0;

    for (const contentItem of missingContent) {
      // Check if content already exists
      const existing = await prisma.websiteContent.findFirst({
        where: {
          key: contentItem.key,
          page: contentItem.page
        }
      });

      if (existing) {
        // Update existing content
        await prisma.websiteContent.update({
          where: { id: existing.id },
          data: {
            content: contentItem.content,
            title: contentItem.title,
            contentType: contentItem.contentType,
            section: contentItem.section,
            isActive: contentItem.isActive
          }
        });
        updated++;
      } else {
        // Create new content
        await prisma.websiteContent.create({
          data: contentItem
        });
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Content fixed: ${created} created, ${updated} updated`,
      created,
      updated
    });

  } catch (error) {
    console.error('Error fixing content:', error);
    return NextResponse.json(
      { error: 'Failed to fix content' },
      { status: 500 }
    );
  }
}
