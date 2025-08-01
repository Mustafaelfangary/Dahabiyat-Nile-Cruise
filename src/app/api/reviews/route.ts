import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET endpoint for fetching reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dahabiyaId = searchParams.get("dahabiyaId");
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const featured = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const includeAll = searchParams.get("includeAll") === "true";

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    const where: any = {};

    // Non-admin users can only see approved reviews (unless viewing their own)
    if (!isAdmin && !includeAll) {
      if (userId && session?.user?.id === userId) {
        // Users can see their own reviews regardless of status
        where.userId = userId;
      } else {
        // Public can only see approved reviews
        where.status = "APPROVED";
      }
    } else if (status && isAdmin) {
      where.status = status;
    } else if (!isAdmin) {
      where.status = "APPROVED";
    }

    if (dahabiyaId) {
      where.dahabiyaId = dahabiyaId;
    }

    if (userId && (!session || session.user.id !== userId) && !isAdmin) {
      where.userId = userId;
    }

    if (featured) {
      where.isHomepageFeatured = true;
    }

    const reviews = await prisma.review.findMany({
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
        // dahabiya: {  // REMOVED: dahabiya relation removed
        //   select: {
        //     id: true,
        //     name: true,
        //   },
        // },
      },
      orderBy: [
        { homepageOrder: "asc" },
        { createdAt: "desc" },
      ],
      ...(limit && { take: limit }),
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

const reviewSchema = z.object({
  dahabiyaId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
  title: z.string().optional(),
  photos: z.array(z.string()).optional(),
  location: z.string().optional(),
  tripDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = reviewSchema.parse(body);

    // Check if user has a confirmed booking for this dahabiya
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        status: "CONFIRMED",
      },
    });

    if (!hasBooking) {
      return NextResponse.json(
        { error: "You can only review dahabiyas you have booked" },
        { status: 403 }
      );
    }

    // Check if user has already reviewed (limit one review per user per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: today
        }
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already submitted a review today. Please wait 24 hours before submitting another review." },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: validated.rating,
        comment: validated.comment,
        title: validated.title ?? null,
        photos: validated.photos || [],
        location: validated.location ?? null,
        tripDate: validated.tripDate ?? null,
        userId: session.user.id,
        status: "PENDING", // All reviews need admin approval
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

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT endpoint for admin review management
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, status, adminNotes, isHomepageFeatured, homepageOrder } = data;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        status,
        adminNotes,
        isHomepageFeatured: isHomepageFeatured || false,
        homepageOrder: homepageOrder || null,
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

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE endpoint for admin review management
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    // Users can only delete their own reviews, admins can delete any
    const where: any = { id };
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id;
    }

    const review = await prisma.review.findFirst({ where });
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
