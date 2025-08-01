import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/ships
export async function GET() {
  try {
    // Mock ships data since Ship model doesn't exist
    const ships = [
      {
        id: '1',
        name: 'Cleopatra Dahabiya',
        imageUrl: '/images/ships/cleopatra.jpg',
        capacity: 12,
        yearBuilt: 2020,
        specifications: 'Luxury traditional dahabiya with modern amenities'
      }
    ];
    console.log('Found ships:', ships);
    return NextResponse.json(ships);
  } catch (error) {
    console.error('Error fetching ships:', error);
    return NextResponse.json({ error: 'Failed to fetch ships' }, { status: 500 });
  }
}

// POST /api/ships
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Mock ship creation since Ship model doesn't exist
    const ship = {
      id: Date.now().toString(),
      name: data.name,
      imageUrl: data.imageUrl,
      capacity: data.capacity,
      yearBuilt: data.yearBuilt,
      specifications: data.specifications,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(ship);
  } catch (error) {
    console.error('Error creating ship:', error);
    return NextResponse.json({ error: 'Failed to create ship' }, { status: 500 });
  }
}