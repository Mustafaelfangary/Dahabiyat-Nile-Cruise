import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Try to query the User table to see if resetToken fields exist
    const testUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        resetToken: true,
        resetTokenExpiry: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Database schema includes reset token fields',
      hasResetTokenFields: true,
      testUser: testUser ? {
        id: testUser.id,
        email: testUser.email,
        hasResetToken: !!testUser.resetToken,
        hasResetTokenExpiry: !!testUser.resetTokenExpiry
      } : null
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Database schema test error:', error);
    
    // Check if the error is related to missing columns
    if (errorMessage && errorMessage.includes('resetToken')) {
      return NextResponse.json({
        success: false,
        message: 'Reset token fields are missing from database schema',
        hasResetTokenFields: false,
        error: errorMessage,
        needsMigration: true
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Database connection or other error',
      error: errorMessage
    }, { status: 500 });
  }
}
