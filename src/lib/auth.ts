import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log('Found user:', user ? 'yes' : 'no');

        if (!user) {
          console.log('User not found');
          return null;
        }

        if (!user.password) {
          console.log('User has no password');
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          console.log('Invalid password');
          return null;
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
          console.log('Email not verified for user:', user.email);
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        console.log('Authentication successful for user:', user.email);

        // Keep all roles for proper authorization
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Keep original role: ADMIN, MANAGER, GUIDE, USER
          originalRole: user.role, // Store original role for reference
          image: user.image
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl, token }) {
      console.log('Auth redirect called with:', { url, baseUrl, token });

      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        url = `${baseUrl}${url}`;
      }

      // If it's the same origin and not a sign-in page, allow it
      if (url && new URL(url).origin === baseUrl) {
        const urlPath = new URL(url).pathname;

        // Don't redirect auth pages if user is already authenticated
        if ((urlPath === '/auth/signin' || urlPath === '/auth/signup') && token) {
          // User is authenticated and trying to access auth pages, redirect based on role
          if (token.role === 'ADMIN') {
            return `${baseUrl}/admin`;
          } else if (token.role === 'MANAGER') {
            return `${baseUrl}/admin/dashboard`;
          } else if (token.role === 'GUIDE') {
            return `${baseUrl}/guide/dashboard`;
          } else {
            return `${baseUrl}/profile`;
          }
        }

        return url;
      }

      // For sign-in redirects without a specific URL, use role-based redirect
      if (token?.role) {
        console.log('Redirecting based on role:', token.role);

        switch (token.role) {
          case 'ADMIN':
            return `${baseUrl}/admin`;
          case 'MANAGER':
            return `${baseUrl}/admin/dashboard`;
          case 'GUIDE':
            return `${baseUrl}/guide/dashboard`;
          default:
            return `${baseUrl}/profile`;
        }
      }

      // Default to homepage
      return `${baseUrl}/`;
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role as "ADMIN" | "MANAGER" | "GUIDE" | "USER";
        session.user.originalRole = token.originalRole as "ADMIN" | "MANAGER" | "GUIDE" | "USER";
        session.user.image = token.image as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.originalRole = user.originalRole || user.role;
        token.image = user.image;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
};
