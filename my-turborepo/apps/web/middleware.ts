/**
 * Next.js Middleware
 * 
 * Handles authentication and route protection.
 * Refreshes Supabase sessions on each request.
 * 
 * @module middleware
 */

import { NextResponse, type NextRequest } from 'next/server';
import { updateSession, protectedRoutes, authRoutes } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    const pathname = request.nextUrl.pathname;

    // Check if route requires authentication
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users from protected routes to login
    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes to dashboard
    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
