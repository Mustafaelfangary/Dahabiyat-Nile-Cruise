import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { isFeaturedOnHomepage, homepageOrder } = body;

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        ...(typeof isFeaturedOnHomepage === 'boolean' && { isFeaturedOnHomepage }),
        ...(homepageOrder !== undefined && { homepageOrder }),
      },
    });

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error("Error updating package featured status:", error);
    return NextResponse.json(
      { error: "Failed to update package featured status" },
      { status: 500 }
    );
  }
}
