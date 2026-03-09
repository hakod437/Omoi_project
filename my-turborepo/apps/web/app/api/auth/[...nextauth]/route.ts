/**
 * NextAuth.js API Route
 *
 * Handles authentication requests
 *
 * @module app/api/auth/[...nextauth]/route
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

console.log('[NEXTAUTH API] 🔧 Loading NextAuth API route...');
console.log('[NEXTAUTH API] 📦 authOptions imported:', !!authOptions);
console.log('[NEXTAUTH API] 🔑 Providers configured:', authOptions?.providers?.length || 0);

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
