import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const logoContent = await prisma.websiteContent.findMany({
      where: {
        key: {
          in: ['site_logo', 'navbar_logo', 'footer_logo', 'site_favicon']
        },
        isActive: true
      },
      orderBy: { key: 'asc' }
    });

    return NextResponse.json(logoContent);
  } catch (error) {
    console.error('Error fetching logo content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logo content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { logoType, logoUrl } = body;

    if (!logoType || !logoUrl) {
      return NextResponse.json(
        { error: 'Logo type and URL are required' },
        { status: 400 }
      );
    }

    // Map logo types to their keys
    const logoKeyMap: Record<string, string> = {
      'site': 'site_logo',
      'navbar': 'navbar_logo', 
      'footer': 'footer_logo',
      'favicon': 'site_favicon'
    };

    const key = logoKeyMap[logoType];
    if (!key) {
      return NextResponse.json(
        { error: 'Invalid logo type' },
        { status: 400 }
      );
    }

    const logoContent = await prisma.websiteContent.upsert({
      where: { key },
      update: {
        content: logoUrl,
        contentType: logoType === 'favicon' ? 'IMAGE' : 'IMAGE',
        page: 'branding_settings',
        section: 'branding',
        isActive: true
      },
      create: {
        key,
        title: `${logoType.charAt(0).toUpperCase() + logoType.slice(1)} Logo`,
        content: logoUrl,
        contentType: 'IMAGE',
        page: 'branding_settings',
        section: 'branding',
        order: logoType === 'site' ? 1 : logoType === 'navbar' ? 2 : logoType === 'footer' ? 3 : 4,
        isActive: true
      }
    });

    // Revalidate all pages to update logo
    try {
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/contact');
      revalidatePath('/packages');
      revalidatePath('/dahabiyas');
      revalidatePath('/itineraries');
      revalidatePath('/schedule-and-rates');
      revalidatePath('/blog');
      revalidatePath('/blogs');
      revalidatePath('/tailor-made');
    } catch (error) {
      console.log('Cache revalidation failed:', error);
    }

    return NextResponse.json(logoContent);
  } catch (error) {
    console.error('Error updating logo:', error);
    return NextResponse.json(
      { error: 'Failed to update logo' },
      { status: 500 }
    );
  }
}
