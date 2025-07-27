import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// REMOVED: enhanced-creation-utils imports - file deleted
// import {
//   generateSlug,
//   createEnhancedPackagePage,
//   createEnhancedPackageContent
// } from '@/lib/enhanced-creation-utils';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";

    const skip = (page - 1) * limit;

    const where = featured ? { isFeaturedOnHomepage: true } : {};

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        include: {
          itineraryDays: {
            include: {
              images: true,
            },
            orderBy: { dayNumber: 'asc' },
          },
        },
        orderBy: featured
          ? [
              { homepageOrder: "asc" },
              { createdAt: "desc" }
            ]
          : { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.package.count({ where }),
    ]);

    return NextResponse.json({
      packages,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      shortDescription,
      price,
      durationDays,
      mainImageUrl,
      itineraryDays,
    } = body;

    // Generate slug from name
    const slug = generateSlug(name);
    console.log(`📦 Creating enhanced package: ${name} (${slug})`);

    const createdPackage = await prisma.package.create({
      data: {
        name,
        description,
        shortDescription,
        price,
        durationDays,
        mainImageUrl,
        itineraryDays: {
          create: (itineraryDays || []).map((day: any, idx: number) => ({
            dayNumber: idx + 1,
            title: day.title,
            description: day.description,
            images: {
              create: (day.images || []).map((img: any) => ({
                url: img.url,
                alt: img.alt || '',
                category: 'INDOOR', // Default category for package images
              })),
            },
          })),
        },
      },
      include: {
        itineraryDays: { include: { images: true } },
      },
    });

    // REMOVED: Enhanced page structure creation - functions deleted
    // try {
    //   console.log(`📄 Creating enhanced page file for ${slug}...`);
    //   await createEnhancedPackagePage(name, slug);
    //   console.log(`🔑 Creating enhanced content keys for ${slug}...`);
    //   await createEnhancedPackageContent(slug, name, body);
    //   console.log(`✅ Enhanced package creation completed for ${slug}`);
    // } catch (enhancementError) {
    //   console.error('❌ Error creating enhanced structure:', enhancementError);
    //   // Don't fail the entire request if enhancement fails
    //   // The package is still created in the database
    // }

    return NextResponse.json({
      ...createdPackage,
      slug,
      enhanced: true,
      message: 'Enhanced package created successfully with individual page and content management'
    });
  } catch (error) {
    console.error('Error creating package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return new NextResponse('Missing package id', { status: 400 });

    // Build update data object, only including defined fields
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.durationDays !== undefined) updateData.durationDays = body.durationDays;
    if (body.mainImageUrl !== undefined) updateData.mainImageUrl = body.mainImageUrl;
    if (body.isFeaturedOnHomepage !== undefined) updateData.isFeaturedOnHomepage = body.isFeaturedOnHomepage;
    if (body.homepageOrder !== undefined) updateData.homepageOrder = body.homepageOrder;

    const updated = await prisma.package.update({
      where: { id: body.id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating package:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    await prisma.package.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}