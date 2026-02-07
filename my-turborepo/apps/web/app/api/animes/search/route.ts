/**
 * Anime Search API Route
 * 
 * GET /api/animes/search - Search animes via Jikan API
 * 
 * @module app/api/animes/search/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAnimeService } from '@/lib/services';
import { successResponse, errorResponse, ERROR_CODES } from '@/types/api';

// Rate limiting: Jikan has a limit of 3 requests per second
let lastRequest = 0;
const MIN_REQUEST_INTERVAL = 350; // ms

/**
 * GET /api/animes/search
 * 
 * Search for animes using Jikan API.
 * Includes rate limiting to respect Jikan's limits.
 * 
 * Query params:
 * - q: string (required, min 3 characters)
 * - limit: number (default: 10, max: 25)
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
        const limit = Math.min(25, Math.max(1, parseInt(searchParams.get('limit') || '10')));

        // Validation
        if (query.length < 3) {
            return NextResponse.json(
                errorResponse(ERROR_CODES.VALIDATION_ERROR, 'Query must be at least 3 characters'),
                { status: 400 }
            );
        }

        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequest;
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
        }
        lastRequest = Date.now();

        // Search
        const animeService = createAnimeService(supabase, user.id);
        const results = await animeService.searchAnimes(query);

        return NextResponse.json(successResponse(results.slice(0, limit)));
    } catch (error) {
        console.error('GET /api/animes/search error:', error);
        return NextResponse.json(
            errorResponse(ERROR_CODES.EXTERNAL_API_ERROR, 'Failed to search animes'),
            { status: 502 }
        );
    }
}
