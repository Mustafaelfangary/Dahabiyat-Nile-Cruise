import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest, token: any) {
    // Simple middleware - just let withAuth handle the authorization
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // For admin routes, require admin role
        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        // For profile and booking routes, require authentication
        if (pathname.startsWith("/profile") || pathname.startsWith("/bookings")) {
          return !!token;
        }

        // For API routes that need protection
        if (pathname.startsWith("/api/admin") ||
            pathname.startsWith("/api/upload") ||
            pathname.startsWith("/api/media-assets") ||
            pathname.startsWith("/api/content")) {
          return !!token;
        }

        // Allow all other routes
        return true;
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/bookings/:path*",
    "/admin/:path*",
    // Protect specific API routes but exclude NextAuth
    "/api/admin/:path*",
    "/api/upload/:path*",
    "/api/media-assets/:path*",
    // Note: /api/dahabiyat and /api/packages GET requests should be public for homepage
    // Only protect POST/PUT/DELETE operations via individual route authentication
    "/api/content/:path*",
  ],
};
