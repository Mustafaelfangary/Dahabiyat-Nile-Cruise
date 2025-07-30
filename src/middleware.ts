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
        // For admin routes, require admin role
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        // For other protected routes, require authentication
        return !!token;
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
