import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Fetch single tailor-made request (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const tailorMadeRequest = await prisma.tailorMadeRequest.findUnique({
      where: { id }
    });

    if (!tailorMadeRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(tailorMadeRequest);

  } catch (error) {
    console.error('Error fetching tailor-made request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update tailor-made request (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes, quotedPrice, responseMessage } = body;

    // Check if request exists
    const existingRequest = await prisma.tailorMadeRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Update the request
    const updatedRequest = await prisma.tailorMadeRequest.update({
      where: { id },
      data: {
        status: status || existingRequest.status,
        adminNotes: adminNotes !== undefined ? adminNotes : existingRequest.adminNotes,
        quotedPrice: quotedPrice !== undefined ? quotedPrice : existingRequest.quotedPrice,
        responseMessage: responseMessage !== undefined ? responseMessage : existingRequest.responseMessage,
        respondedAt: responseMessage ? new Date() : existingRequest.respondedAt,
        respondedBy: responseMessage ? session.user.id : existingRequest.respondedBy,
        updatedAt: new Date()
      }
    });

    // If status changed to QUOTED or CONFIRMED, send notification to customer
    if (status && status !== existingRequest.status && (status === 'QUOTED' || status === 'CONFIRMED')) {
      try {
        // TODO: Send email notification to customer
        console.log(`Tailor-made request ${id} status updated to ${status} for ${existingRequest.email}`);
      } catch (emailError) {
        console.error('Error sending customer notification:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Request updated successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Error updating tailor-made request:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete tailor-made request (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if request exists
    const existingRequest = await prisma.tailorMadeRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Delete the request
    await prisma.tailorMadeRequest.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Request deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tailor-made request:', error);
    return NextResponse.json(
      { error: 'Failed to delete request' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
