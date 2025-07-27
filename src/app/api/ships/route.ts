import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/ships
export async function GET() {
  try {
    const ships = await prisma.ship.findMany();
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
    const ship = await prisma.ship.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        capacity: data.capacity,
        yearBuilt: data.yearBuilt,
        specifications: data.specifications,
      },
    });

    return NextResponse.json(ship);
  } catch (error) {
    console.error('Error creating ship:', error);
    return NextResponse.json({ error: 'Failed to create ship' }, { status: 500 });
  }
} 