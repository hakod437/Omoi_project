/**
 * Animes API Route
 * 
 * GET /api/animes - Get user's anime list
 * POST /api/animes - Add anime to list
 * 
 * @module app/api/animes/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAnimeService, type AddAnimeInput } from '@/lib/services';
import { successResponse, errorResponse, ERROR_CODES } from '@/types/api';

/**
 * GET /api/animes
 * 
 * Get current user's anime list with pagination and sorting.
 * 
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - sortBy: 'added_at' | 'user_rating' | 'title' (default: 'added_at')
 * - sortOrder: 'asc' | 'desc' (default: 'desc')
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
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
        const sortBy = (searchParams.get('sortBy') || 'added_at') as 'added_at' | 'user_rating' | 'title';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

        // Get anime list
        const animeService = createAnimeService(supabase, user.id);
        const { data, total } = await animeService.getUserAnimeList({
            page,
            limit,
            sortBy,
            sortOrder,
        });

        return NextResponse.json(
            successResponse(data, {
                total,
                page,
                limit,
                hasMore: page * limit < total,
            })
        );
    } catch (error) {
        console.error('GET /api/animes error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.INTERNAL_ERROR, 'Failed to fetch anime list'),
            { status: 500 }
        );
    }
}

/**
 * POST /api/animes
 * 
 * Add an anime to the user's list.
 * 
 * Body:
 * - malId: number (required)
 * - userRating: number 1-6 (required)
 * - animationRating: number 1-6 (required)
 * - userDescription: string (optional)
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
        const { malId, userRating, animationRating, userDescription } = body;

        // Validation
        if (!malId || typeof malId !== 'number') {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'malId is required and must be a number'),
                { status: 400 }
            );
        }
        if (!userRating || userRating < 1 || userRating > 6) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'userRating must be between 1 and 6'),
                { status: 400 }
            );
        }
        if (!animationRating || animationRating < 1 || animationRating > 6) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'animationRating must be between 1 and 6'),
                { status: 400 }
            );
        }

        // Add anime
        const animeService = createAnimeService(supabase, user.id);
        const input: AddAnimeInput = {
            malId,
            userRating,
            animationRating,
            userDescription,
        };

        const result = await animeService.addAnimeToList(input);

        return NextResponse.json(successResponse(result), { status: 201 });
    } catch (error) {
        console.error('POST /api/animes error:', error);

        const message = error instanceof Error ? error.message : 'Failed to add anime';
        const isConflict = message.includes('already in your list');

        return NextResponse.json(
            errorResponse(
                isConflict ? ERROR_CODES.ALREADY_EXISTS : ERROR_CODES.INTERNAL_ERROR,
                message
            ),
            { status: isConflict ? 409 : 500 }
        );
    }
}
