import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all dahabiyat for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dahabiyat = await prisma.dahabiya.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        capacity: true,
        cabins: true,
        crew: true,
        pricePerDay: true,
        category: true,
        isActive: true,
        isFeatured: true,
        rating: true,
        reviewCount: true,
        mainImage: true,
        features: true,
        amenities: true,
        routes: true,
        highlights: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            availabilityDates: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(dahabiyat);

  } catch (error) {
    console.error('Error fetching dahabiyat:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dahabiyat' },
      { status: 500 }
    );
  }
}

// POST - Create new dahabiya
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      capacity,
      pricePerDay,
      category,
      status,
      features,
      location,
      length,
      width,
      yearBuilt,
      maxSpeed,
      crewSize,
      safetyFeatures,
      entertainmentFeatures,
      diningFeatures,
      isActive,
      isFeatured
    } = body;

    if (!name || !description || !capacity || !pricePerDay) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, capacity, pricePerDay' },
        { status: 400 }
      );
    }

    const dahabiya = await prisma.dahabiya.create({
      data: {
        name,
        description,
        capacity: parseInt(capacity),
        pricePerDay: parseFloat(pricePerDay),
        category: category || 'LUXURY',
        status: status || 'ACTIVE',
        features: features || [],
        location: location || '',
        length: length ? parseFloat(length) : null,
        width: width ? parseFloat(width) : null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        maxSpeed: maxSpeed ? parseFloat(maxSpeed) : null,
        crewSize: crewSize ? parseInt(crewSize) : null,
        safetyFeatures: safetyFeatures || [],
        entertainmentFeatures: entertainmentFeatures || [],
        diningFeatures: diningFeatures || [],
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false
      }
    });

    return NextResponse.json({
      message: 'Dahabiya created successfully',
      dahabiya
    });

  } catch (error) {
    console.error('Error creating dahabiya:', error);
    return NextResponse.json(
      { error: 'Failed to create dahabiya' },
      { status: 500 }
    );
  }
}
