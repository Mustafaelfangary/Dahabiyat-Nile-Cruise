import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ fieldId: string }> }
) {
  try {
    console.log('=== API SAVE REQUEST START ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);

    const session = await getServerSession(authOptions);
    console.log('Session:', session ? { user: session.user } : 'No session');

    if (!session || session.user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    const { value, content, page, section, key } = body;
    const { fieldId } = await params;
    console.log('Field ID from params:', fieldId);

    // Use content field if available, otherwise use value field
    const rawValue = content !== undefined ? content : value;
    // Ensure value is a string (convert undefined/null to empty string)
    const sanitizedValue = rawValue !== undefined && rawValue !== null ? String(rawValue) : '';

    // Use the key from body if provided, otherwise use fieldId
    const dbKey = key || fieldId;

    // Determine the correct group based on the page/section
    const groupName = page || section || 'website-content';

    console.log('Processing save:', {
      dbKey,
      sanitizedValue,
      groupName,
      originalValue: rawValue
    });

    // Update the content in the settings table
    console.log('Attempting database upsert...');
    const updatedContent = await prisma.setting.upsert({
      where: { key: dbKey },
      update: {
        value: sanitizedValue,
        group: groupName,
      },
      create: {
        key: dbKey,
        value: sanitizedValue,
        group: groupName,
      },
    });

    console.log('✅ Database upsert successful:', updatedContent);

    // Invalidate cache for the relevant pages
    try {
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/contact');
      revalidatePath('/packages');
      revalidatePath('/dahabiyat');
      revalidatePath('/tailor-made');
    } catch (error) {
      console.log('Cache revalidation failed:', error);
    }

    const response = {
      success: true,
      content: updatedContent
    };

    console.log('✅ Sending success response:', response);
    console.log('=== API SAVE REQUEST END ===');

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error updating field:', error);
    console.log('=== API SAVE REQUEST FAILED ===');
    return NextResponse.json(
      { error: 'Failed to update field' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fieldId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fieldId } = await params;
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') || fieldId;

    // Get the content from the settings table
    const content = await prisma.setting.findUnique({
      where: { key },
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      content: content.value
    });

  } catch (error) {
    console.error('Error fetching field:', error);
    return NextResponse.json(
      { error: 'Failed to fetch field' },
      { status: 500 }
    );
  }
}
