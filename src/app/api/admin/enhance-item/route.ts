import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// REMOVED: enhanced-creation-utils imports - file deleted
// import {
//   createEnhancedDahabiyaPage,
//   createEnhancedPackagePage,
//   createEnhancedDahabiyaContent,
//   createEnhancedPackageContent
// } from '@/lib/enhanced-creation-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug, name, type } = await request.json();

    if (!slug || !name || !type) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    console.log(`🔧 Enhancing ${type}: ${name} (${slug})`);

    if (type === 'dahabiya') {
      // Get dahabiya data from database
      const dahabiya = await prisma.dahabiya.findFirst({
        where: { 
          OR: [
            { name: name },
            { name: { contains: name } }
          ]
        }
      });

      if (!dahabiya) {
        return NextResponse.json({ error: 'Dahabiya not found in database' }, { status: 404 });
      }

      // REMOVED: Enhanced creation functions - file deleted
      // await createEnhancedDahabiyaPage(name, slug);
      // await createEnhancedDahabiyaContent(slug, name, {
      //   shortDescription: dahabiya.shortDescription,
      //   description: dahabiya.description,
      //   pricePerDay: dahabiya.pricePerDay,
      //   capacity: dahabiya.capacity
      // });

    } else if (type === 'package') {
      // Get package data from database
      const pkg = await prisma.package.findFirst({
        where: { 
          OR: [
            { name: name },
            { name: { contains: name } }
          ]
        }
      });

      if (!pkg) {
        return NextResponse.json({ error: 'Package not found in database' }, { status: 404 });
      }

      // REMOVED: Enhanced creation functions - file deleted
      // await createEnhancedPackagePage(name, slug);
      // await createEnhancedPackageContent(slug, name, {
      //   shortDescription: pkg.shortDescription,
      //   description: pkg.description,
      //   price: pkg.price,
      //   durationDays: pkg.durationDays,
      //   mainImageUrl: pkg.mainImageUrl
      // });

    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    console.log(`✅ Successfully enhanced ${type}: ${slug}`);

    return NextResponse.json({ 
      success: true, 
      message: `${type} enhanced successfully`,
      slug,
      name,
      type
    });

  } catch (error) {
    console.error('Error enhancing item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
