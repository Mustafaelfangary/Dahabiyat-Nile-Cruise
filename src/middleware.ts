import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest, token: any) {
    console.log("middleware", req.nextUrl.pathname);
    
    // Handle admin routes
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    if (isAdminRoute) {
      // Check if user has admin role
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
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
    // "/admin/:path*", // Temporarily disabled for testing
    // Protect specific API routes but exclude NextAuth
    "/api/admin/:path*",
    "/api/upload/:path*",
    "/api/media-assets/:path*",
    // Note: /api/dahabiyat and /api/packages GET requests should be public for homepage
    // Only protect POST/PUT/DELETE operations via individual route authentication
    "/api/content/:path*",
  ],
};
