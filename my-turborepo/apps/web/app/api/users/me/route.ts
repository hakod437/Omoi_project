/**
 * Current User API Route
 * 
 * GET /api/users/me - Get current user profile
 * PUT /api/users/me - Update current user profile
 * 
 * @module app/api/users/me/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createUserService, type UpdateProfileInput } from '@/lib/services';
import { successResponse, errorResponse, ERROR_CODES } from '@/types/api';

/**
 * GET /api/users/me
 * 
 * Get current user's profile with optional stats.
 * 
 * Query params:
 * - includeStats: boolean (default: false)
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check auth
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
                { status: 401 }
            );
        }

        // Parse query params
        const searchParams = request.nextUrl.searchParams;
        const includeStats = searchParams.get('includeStats') === 'true';

        const userService = createUserService(supabase, authUser.id);
        const user = await userService.getCurrentUser();

        if (!user) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.NOT_FOUND, 'User profile not found'),
                { status: 404 }
            );
        }

        if (includeStats) {
            const stats = await userService.getUserStats();
            return NextResponse.json(successResponse({ ...user, stats }));
        }

        return NextResponse.json(successResponse(user));
    } catch (error) {
        console.error('GET /api/users/me error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch profile'),
            { status: 500 }
        );
    }
}

/**
 * PUT /api/users/me
 * 
 * Update current user's profile.
 * 
 * Body (all optional):
 * - displayName: string
 * - avatarUrl: string
 */
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check auth
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
                { status: 401 }
            );
        }

        // Parse body
        const body = await request.json();
        const { displayName, avatarUrl } = body;

        // Validation
        if (displayName !== undefined && typeof displayName !== 'string') {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'displayName must be a string'),
                { status: 400 }
            );
        }
        if (avatarUrl !== undefined && typeof avatarUrl !== 'string') {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'avatarUrl must be a string'),
                { status: 400 }
            );
        }

        const userService = createUserService(supabase, authUser.id);
        const input: UpdateProfileInput = {
            displayName,
            avatarUrl,
        };

        const result = await userService.updateProfile(input);

        return NextResponse.json(successResponse(result));
    } catch (error) {
        console.error('PUT /api/users/me error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to update profile'),
            { status: 500 }
        );
    }
}
