/**
 * Supabase Server Client
 * 
 * Use this client in:
 * - Server Components
 * - API Routes (Route Handlers)
 * - Server Actions
 * 
 * @module lib/supabase/server
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Creates a Supabase client for server-side usage.
 * Handles cookie-based session management for SSR.
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * import { createClient } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // ...
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // In an API Route
 * import { createClient } from '@/lib/supabase/server';
 * 
 * export async function GET() {
 *   const supabase = await createClient();
 *   // ...
 * }
 * ```
 */
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    );
}

/**
 * Creates a Supabase admin client with service role.
 * ⚠️ Only use this for operations that bypass RLS.
 * 
 * @example
 * ```tsx
 * // For admin operations like caching anime data
 * const adminClient = createAdminClient();
 * await adminClient.from('animes').upsert(animeData);
 * ```
 */
export function createAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    }

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            cookies: {
                getAll: () => [],
                setAll: () => { },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
