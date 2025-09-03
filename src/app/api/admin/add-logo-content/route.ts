import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Logo content to add
    const logoContent = [
      {
        key: 'navbar_logo',
        title: 'Navigation Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'branding',
        order: 1,
        isActive: true
      },
      {
        key: 'site_favicon',
        title: 'Site Favicon',
        content: '/favicon.ico',
        contentType: 'IMAGE',
        page: 'global_media',
        section: 'branding',
        order: 2,
        isActive: true
      },
      {
        key: 'footer_logo',
        title: 'Footer Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'footer',
        section: 'branding',
        order: 1,
        isActive: true
      },
      {
        key: 'admin_logo',
        title: 'Admin Panel Logo',
        content: '/images/logo.png',
        contentType: 'IMAGE',
        page: 'admin',
        section: 'branding',
        order: 1,
        isActive: true
      }
    ];

    let created = 0;
    let updated = 0;

    for (const item of logoContent) {
      const existing = await prisma.websiteContent.findFirst({
        where: { key: item.key }
      });

      if (existing) {
        await prisma.websiteContent.update({
          where: { id: existing.id },
          data: item
        });
        updated++;
      } else {
        await prisma.websiteContent.create({
          data: item
        });
        created++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Logo content added successfully!`,
      summary: {
        created,
        updated,
        total: logoContent.length
      }
    });

  } catch (error) {
    console.error('Error adding logo content:', error);
    return NextResponse.json(
      { error: 'Failed to add logo content' },
      { status: 500 }
    );
  }
}
