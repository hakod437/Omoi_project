/**
 * User Search API Route
 * 
 * GET /api/users/search - Search users by email or display name
 * 
 * @module app/api/users/search/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createUserService } from '@/lib/services';
import { successResponse, errorResponse, ERROR_CODES } from '@/types/api';

/**
 * GET /api/users/search
 * 
 * Search for users to add as friends.
 * 
 * Query params:
 * - q: string (required, min 3 characters)
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
                { status: 401 }
            );
        }

        // Parse query params
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';

        // Validation
        if (query.length < 3) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'Query must be at least 3 characters'),
                { status: 400 }
            );
        }

        const userService = createUserService(supabase, user.id);
        const results = await userService.searchUsers(query);

        return NextResponse.json(successResponse(results));
    } catch (error) {
        console.error('GET /api/users/search error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to search users'),
            { status: 500 }
        );
    }
}
