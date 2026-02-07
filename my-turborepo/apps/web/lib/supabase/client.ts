/**
 * Supabase Browser Client
 * 
 * Use this client in React Client Components.
 * It handles session management via cookies automatically.
 * 
 * @module lib/supabase/client
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Creates a Supabase client for browser/client-side usage.
 * This should be used in Client Components (use client).
 * 
 * @example
 * ```tsx
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 * 
 * export function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase...
 * }
 * ```
 */
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

// Singleton instance for cases where we need a stable reference
let browserClient: ReturnType<typeof createClient> | null = null;

/**
 * Get a singleton Supabase client instance.
 * Useful for auth state listeners and other cases requiring stable reference.
 */
export function getClient() {
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
