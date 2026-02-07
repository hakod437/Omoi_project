/**
 * Supabase Middleware Helper
 * 
 * Updates the Supabase session in middleware.
 * This ensures the session is always fresh across requests.
 * 
 * @module lib/supabase/middleware
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Updates the Supabase session and returns the response with refreshed cookies.
 * Use this in Next.js middleware to keep sessions alive.
 * 
 * @example
 * ```tsx
 * // middleware.ts
 * import { updateSession } from '@/lib/supabase/middleware';
 * 
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 * ```
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh the session - this will extend the session if it's about to expire
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return { supabaseResponse, user };
}

/**
 * Protected routes configuration.
 * Add paths that require authentication here.
 */
export const protectedRoutes = ['/dashboard', '/profile', '/settings'];

/**
 * Auth routes - redirect to dashboard if already logged in.
 */
export const authRoutes = ['/auth/login', '/auth/register'];
