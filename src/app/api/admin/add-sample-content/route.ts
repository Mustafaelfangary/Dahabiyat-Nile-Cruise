import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Sample content to add
    const sampleContent = [
      // Homepage content
      {
        key: 'hero_title',
        title: 'Hero Title',
        content: 'Discover the Magic of the Nile',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 1,
        isActive: true
      },
      {
        key: 'hero_subtitle',
        title: 'Hero Subtitle',
        content: 'Experience luxury cruising on traditional dahabiyas',
        contentType: 'TEXT',
        page: 'homepage',
        section: 'hero',
        order: 2,
        isActive: true
      },
      {
        key: 'hero_image',
        title: 'Hero Background Image',
        content: '/images/hero-bg.jpg',
        contentType: 'IMAGE',
        page: 'homepage',
        section: 'hero',
        order: 3,
        isActive: true
      },
      
      // About page content
      {
        key: 'about_title',
        title: 'About Page Title',
        content: 'About Our Nile Cruises',
        contentType: 'TEXT',
        page: 'about',
        section: 'main',
        order: 1,
        isActive: true
      },
      {
        key: 'about_description',
        title: 'About Description',
        content: 'We offer authentic Egyptian experiences aboard traditional dahabiyas, combining luxury with cultural immersion.',
        contentType: 'TEXTAREA',
        page: 'about',
        section: 'main',
        order: 2,
        isActive: true
      },
      
      // Contact page content
      {
        key: 'contact_title',
        title: 'Contact Page Title',
        content: 'Get in Touch',
        contentType: 'TEXT',
        page: 'contact',
        section: 'main',
        order: 1,
        isActive: true
      },
      {
        key: 'contact_email',
        title: 'Contact Email',
        content: 'info@cleopatracruises.com',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 1,
        isActive: true
      },
      {
        key: 'contact_phone',
        title: 'Contact Phone',
        content: '+20 123 456 7890',
        contentType: 'TEXT',
        page: 'contact',
        section: 'info',
        order: 2,
        isActive: true
      },
      
      // Global media
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
      
      // Footer content
      {
        key: 'footer_company_name',
        title: 'Company Name',
        content: 'Cleopatra Cruises',
        contentType: 'TEXT',
        page: 'footer',
        section: 'company',
        order: 1,
        isActive: true
      },
      {
        key: 'footer_copyright',
        title: 'Copyright Text',
        content: '© 2024 Cleopatra Cruises. All rights reserved.',
        contentType: 'TEXT',
        page: 'footer',
        section: 'legal',
        order: 1,
        isActive: true
      }
    ];

    let created = 0;
    let updated = 0;

    for (const item of sampleContent) {
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
      message: `Sample content added successfully!`,
      summary: {
        created,
        updated,
        total: sampleContent.length
      }
    });

  } catch (error) {
    console.error('Error adding sample content:', error);
    return NextResponse.json(
      { error: 'Failed to add sample content' },
      { status: 500 }
    );
  }
}
