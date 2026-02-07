/**
 * Single Anime API Route
 * 
 * GET /api/animes/[id] - Get anime details
 * PUT /api/animes/[id] - Update anime rating/description
 * DELETE /api/animes/[id] - Remove anime from list
 * 
 * @module app/api/animes/[id]/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAnimeService, type UpdateAnimeInput } from '@/lib/services';
import { successResponse, errorResponse, ERROR_CODES } from '@/types/api';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/animes/[id]
 * 
 * Get a single anime from user's list with full details.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
                { status: 401 }
            );
        }

        // Get anime
        const animeService = createAnimeService(supabase, user.id);
        const anime = await animeService.getUserAnime(id);

        if (!anime) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.NOT_FOUND, 'Anime not found'),
                { status: 404 }
            );
        }

        return NextResponse.json(successResponse(anime));
    } catch (error) {
        console.error('GET /api/animes/[id] error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch anime'),
            { status: 500 }
        );
    }
}

/**
 * PUT /api/animes/[id]
 * 
 * Update an anime in user's list.
 * 
 * Body (all optional):
 * - userRating: number 1-6
 * - animationRating: number 1-6
 * - userDescription: string
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
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
        const { userRating, animationRating, userDescription } = body;

        // Validation
        if (userRating !== undefined && (userRating < 1 || userRating > 6)) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'userRating must be between 1 and 6'),
                { status: 400 }
            );
        }
        if (animationRating !== undefined && (animationRating < 1 || animationRating > 6)) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'animationRating must be between 1 and 6'),
                { status: 400 }
            );
        }

        // Update anime
        const animeService = createAnimeService(supabase, user.id);
        const input: UpdateAnimeInput = {
            userRating,
            animationRating,
            userDescription,
        };

        const result = await animeService.updateUserAnime(id, input);

        return NextResponse.json(successResponse(result));
    } catch (error) {
        console.error('PUT /api/animes/[id] error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to update anime'),
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/animes/[id]
 * 
 * Remove an anime from user's list.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.UNAUTHORIZED, 'Authentication required'),
                { status: 401 }
            );
        }

        // Delete anime
        const animeService = createAnimeService(supabase, user.id);
        await animeService.removeFromList(id);

        return NextResponse.json(successResponse({ deleted: true }));
    } catch (error) {
        console.error('DELETE /api/animes/[id] error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to delete anime'),
            { status: 500 }
        );
    }
}
