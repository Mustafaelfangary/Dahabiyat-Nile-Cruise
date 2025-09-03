import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { z } from "zod";
import crypto from "crypto";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9]+$/, "Phone number can only contain digits and an optional '+' prefix")
    .transform(val => val.startsWith('+') ? val : `+${val}`), // Ensure phone number always starts with +
  image: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    console.log('Received signup request');
    const body = await req.json();
    console.log('Request body:', { ...body, password: '[REDACTED]' });

    const { name, email, password, phone, image } = signUpSchema.parse(body);
    console.log('Parsed data:', { name, email, phone, image });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);
    console.log('Password hashed successfully');

    // Generate email verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create the user
    console.log('Creating user in database...');
    const userData = {
      name,
      email,
      password: hashedPassword,
      image: image || null,
      role: "USER" as const, // Default role for new users
      isEmailVerified: false,
      emailVerificationToken: verificationCode,
      emailVerificationExpires: verificationExpires,
    };

    // Add phone only if it exists
    if (phone) {
      (userData as { phone?: string }).phone = phone;
    }

    const user = await prisma.user.create({
      data: userData,
    });
    console.log('User created successfully:', { id: user.id, email: user.email });

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: '🏺 Verify Your Royal Account - Cleopatra Dahabiyat',
        template: 'email-verification',
        data: {
          user: { name, email },
          verificationCode,
          expiresAt: verificationExpires
        }
      });
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail signup if email fails
    }

    // Remove password from response
    const { password: _password, emailVerificationToken: _token, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email for verification code.",
        user: userWithoutPassword,
        requiresVerification: true
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 