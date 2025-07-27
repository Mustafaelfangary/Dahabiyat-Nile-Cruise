import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock categories for now
    // In a real implementation, you would fetch from a MediaCategory table
    const categories = [
      { id: 'images', name: 'Images', count: 0 },
      { id: 'logos', name: 'Logos', count: 0 },
      { id: 'gallery', name: 'Gallery', count: 0 },
      { id: 'uploads', name: 'Uploads', count: 0 }
    ];

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching media categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
