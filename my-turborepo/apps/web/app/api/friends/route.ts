/**
 * Friends API Route
 * 
 * GET /api/friends - Get friend list
 * POST /api/friends - Send friend request
 * 
 * @module app/api/friends/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createFriendService } from '@/lib/services';
import { successResponse, errorResponse, ERROR_CODES } from '@/types/api';

/**
 * GET /api/friends
 * 
 * Get current user's friend list with stats.
 * 
 * Query params:
 * - includeStats: boolean (default: false) - Include anime counts
 * - status: 'all' | 'pending' | 'sent' (default: 'all')
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
        const includeStats = searchParams.get('includeStats') === 'true';
        const status = searchParams.get('status') || 'all';

        const friendService = createFriendService(supabase, user.id);

        let data;
        switch (status) {
            case 'pending':
                data = await friendService.getPendingRequests();
                break;
            case 'sent':
                data = await friendService.getSentRequests();
                break;
            default:
                data = includeStats
                    ? await friendService.getFriendsWithStats()
                    : await friendService.getFriends();
        }

        return NextResponse.json(successResponse(data));
    } catch (error) {
        console.error('GET /api/friends error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch friends'),
            { status: 500 }
        );
    }
}

/**
 * POST /api/friends
 * 
 * Send a friend request.
 * 
 * Body:
 * - userId: string (required) - Target user's ID
 */
export async function POST(request: NextRequest) {
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

        // Parse body
        const body = await request.json();
        const { userId } = body;

        // Validation
        if (!userId || typeof userId !== 'string') {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'userId is required'),
                { status: 400 }
            );
        }

        if (userId === user.id) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'Cannot send friend request to yourself'),
                { status: 400 }
            );
        }

        // Send friend request
        const friendService = createFriendService(supabase, user.id);
        const result = await friendService.sendFriendRequest(userId);

        return NextResponse.json(successResponse(result), { status: 201 });
    } catch (error) {
        console.error('POST /api/friends error:', error);

        const message = error instanceof Error ? error.message : 'Failed to send friend request';
        const isConflict = message.includes('Already friends') || message.includes('already pending');

        return NextResponse.json(
            errorResponse(
                isConflict ? ERROR_CODES.ALREADY_EXISTS : ERROR_CODES.INTERNAL_ERROR,
                message
            ),
            { status: isConflict ? 409 : 500 }
        );
    }
}
