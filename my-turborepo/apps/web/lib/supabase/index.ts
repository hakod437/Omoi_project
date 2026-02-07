// Re-export all Supabase utilities
export { createClient, getClient } from './client';
export { createClient as createServerClient, createAdminClient } from './server';
export { updateSession, protectedRoutes, authRoutes } from './middleware';
