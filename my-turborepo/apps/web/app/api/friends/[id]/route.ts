/**
 * Single Friend API Route
 * 
 * PUT /api/friends/[id] - Accept/reject friend request
 * DELETE /api/friends/[id] - Remove friend or cancel request
 * 
 * @module app/api/friends/[id]/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createFriendService } from '@/lib/services';
import { successResponse, errorResponse, ERROR_CODES } from '@/types/api';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * PUT /api/friends/[id]
 * 
 * Accept or reject a friend request.
 * 
 * Body:
 * - action: 'accept' | 'reject' (required)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: friendshipId } = await params;
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
        const { action } = body;

        // Validation
        if (!action || !['accept', 'reject'].includes(action)) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'action must be "accept" or "reject"'),
                { status: 400 }
            );
        }

        const friendService = createFriendService(supabase, user.id);

        if (action === 'accept') {
            const result = await friendService.acceptRequest(friendshipId);
            return NextResponse.json(successResponse(result));
        } else {
            await friendService.rejectRequest(friendshipId);
            return NextResponse.json(successResponse({ rejected: true }));
        }
    } catch (error) {
        console.error('PUT /api/friends/[id] error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to update friendship'),
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/friends/[id]
 * 
 * Remove a friend or cancel a pending request.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id: friendshipId } = await params;
        const supabase = await createClient();

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
                { status: 401 }
            );
        }

        const friendService = createFriendService(supabase, user.id);
        await friendService.removeFriend(friendshipId);

        return NextResponse.json(successResponse({ deleted: true }));
    } catch (error) {
        console.error('DELETE /api/friends/[id] error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to remove friend'),
            { status: 500 }
        );
    }
}
