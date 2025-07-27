import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const memorySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  location: z.string().optional(),
  tripDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const isAdmin = session.user.role === "ADMIN";

    const where: any = {};
    
    if (!isAdmin) {
      where.userId = session.user.id;
    }
    
    if (status) {
      where.status = status;
    }

    const memories = await prisma.userMemory.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ memories });
  } catch (error) {
    console.error("Error fetching user memories:", error);
    return NextResponse.json(
      { error: "Failed to fetch memories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const validated = memorySchema.parse(data);

    const memory = await prisma.userMemory.create({
      data: {
        ...validated,
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Award loyalty points for sharing memory
    const loyaltyPoints = 100; // Points for sharing a memory

    // Record the loyalty action
    await prisma.loyaltyAction.create({
      data: {
        userId: session.user.id,
        action: 'share-memories',
        points: loyaltyPoints,
        description: 'Shared a travel memory'
      }
    });

    // Update user's total loyalty points
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        loyaltyPoints: {
          increment: loyaltyPoints
        }
      }
    });

    return NextResponse.json({
      ...memory,
      loyaltyPointsEarned: loyaltyPoints
    });
  } catch (error) {
    console.error("Error creating user memory:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create memory" },
      { status: 500 }
    );
  }
}

// Admin endpoints for managing memories
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, status, adminNotes } = data;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const memory = await prisma.userMemory.update({
      where: { id },
      data: {
        status,
        adminNotes,
        ...(status === "APPROVED" && {
          approvedAt: new Date(),
          approvedBy: session.user.id,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(memory);
  } catch (error) {
    console.error("Error updating user memory:", error);
    return NextResponse.json(
      { error: "Failed to update memory" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    // Users can only delete their own memories, admins can delete any
    const where: any = { id };
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id;
    }

    await prisma.userMemory.delete({
      where,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user memory:", error);
    return NextResponse.json(
      { error: "Failed to delete memory" },
      { status: 500 }
    );
  }
}
