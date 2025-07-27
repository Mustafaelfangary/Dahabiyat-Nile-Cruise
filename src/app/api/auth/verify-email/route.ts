import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // If code is provided, verify it
    if (code) {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.isEmailVerified) {
        return NextResponse.json(
          { error: 'Email already verified' },
          { status: 400 }
        );
      }

      if (!user.emailVerificationToken || user.emailVerificationToken !== code) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        );
      }

      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        return NextResponse.json(
          { error: 'Verification code has expired' },
          { status: 400 }
        );
      }

      // Verify the email
      await prisma.user.update({
        where: { email },
        data: {
          isEmailVerified: true,
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully'
      });
    }

    // If no code provided, send verification email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save verification code
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationToken: verificationCode,
        emailVerificationExpires: expiresAt
      }
    });

    // Send verification email
    await sendEmail({
      to: email,
      subject: '🏺 Verify Your Royal Account - Cleopatra Dahabiyat',
      template: 'email-verification',
      data: {
        user: { name: user.name, email: user.email },
        verificationCode,
        expiresAt
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to process email verification' },
      { status: 500 }
    );
  }
}
