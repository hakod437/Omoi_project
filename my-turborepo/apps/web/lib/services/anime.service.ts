/**
 * Anime Service
 * 
 * Business logic for anime-related operations.
 * Handles CRUD operations, Jikan API integration, and caching.
 * 
 * @module lib/services/anime.service
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Anime, AnimeInsert, UserAnime, UserAnimeInsert, UserAnimeUpdate, UserAnimeDetails } from '@/types/database';
import { JikanAnime } from '@/types';

// Cache duration: 7 days
const CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export interface AddAnimeInput {
    malId: number;
    userRating: number;
    animationRating: number;
    userDescription?: string;
}

export interface UpdateAnimeInput {
    userRating?: number;
    animationRating?: number;
    userDescription?: string;
}

export interface AnimeListOptions {
    page?: number;
    limit?: number;
    sortBy?: 'added_at' | 'user_rating' | 'title';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Anime Service Class
 * 
 * Provides all anime-related operations with proper error handling
 * and caching strategies.
 */
export class AnimeService {
    constructor(
        private supabase: SupabaseClient<Database>,
        private userId?: string
    ) { }

    /**
     * Get user's anime list with full anime details
     */
    async getUserAnimeList(options: AnimeListOptions = {}): Promise<{
        data: UserAnimeDetails[];
        total: number;
    }> {
        const {
            page = 1,
            limit = 20,
            sortBy = 'added_at',
            sortOrder = 'desc',
        } = options;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Get total count
        const { count } = await this.supabase
            .from('user_animes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', this.userId!);

        // Get paginated data with anime details
        const { data, error } = await this.supabase
            .from('user_anime_details')
            .select('*')
            .eq('user_id', this.userId!)
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(from, to);

        if (error) {
            throw new Error(`Failed to fetch anime list: ${error.message}`);
        }

        return {
            data: data || [],
            total: count || 0,
        };
    }

    /**
     * Get a single anime from user's list
     */
    async getUserAnime(userAnimeId: string): Promise<UserAnimeDetails | null> {
        const { data, error } = await this.supabase
            .from('user_anime_details')
            .select('*')
            .eq('id', userAnimeId)
            .eq('user_id', this.userId!)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to fetch anime: ${error.message}`);
        }

        return data;
    }

    /**
     * Add an anime to user's list
     * Fetches and caches anime data from Jikan if needed
     */
    async addAnimeToList(input: AddAnimeInput): Promise<UserAnime> {
        // Check if already in list
        const { data: existing } = await this.supabase
            .from('user_animes')
            .select('id')
            .eq('user_id', this.userId!)
            .eq('mal_id', input.malId)
            .single();

        if (existing) {
            throw new Error('Anime already in your list');
        }

        // Ensure anime is cached
        await this.ensureAnimeCached(input.malId);

        // Add to user's list
        const insertData: UserAnimeInsert = {
            user_id: this.userId!,
            mal_id: input.malId,
            user_rating: input.userRating,
            animation_rating: input.animationRating,
            user_description: input.userDescription,
        };

        const { data, error } = await (this.supabase
            .from('user_animes') as any)
            .insert(insertData)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to add anime: ${error.message}`);
        }

        return data;
    }

    /**
     * Update an anime in user's list
     */
    async updateUserAnime(userAnimeId: string, input: UpdateAnimeInput): Promise<UserAnime> {
        const updateData: UserAnimeUpdate = {};

        if (input.userRating !== undefined) {
            updateData.user_rating = input.userRating;
        }
        if (input.animationRating !== undefined) {
            updateData.animation_rating = input.animationRating;
        }
        if (input.userDescription !== undefined) {
            updateData.user_description = input.userDescription;
        }

        const { data, error } = await (this.supabase
            .from('user_animes') as any)
            .update(updateData)
            .eq('id', userAnimeId)
            .eq('user_id', this.userId!)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update anime: ${error.message}`);
        }

        return data;
    }

    /**
     * Remove an anime from user's list
     */
    async removeFromList(userAnimeId: string): Promise<void> {
        const { error } = await this.supabase
            .from('user_animes')
            .delete()
            .eq('id', userAnimeId)
            .eq('user_id', this.userId!);

        if (error) {
            throw new Error(`Failed to remove anime: ${error.message}`);
        }
    }

    /**
     * Search for animes using Jikan API
     */
    async searchAnimes(query: string): Promise<JikanAnime[]> {
        if (!query || query.length < 3) {
            return [];
        }

        try {
            const response = await fetch(
                `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10&sfw=true`
            );

            if (!response.ok) {
                throw new Error('Jikan API error');
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Jikan search error:', error);
            return [];
        }
    }

    /**
     * Get anime by MAL ID (from cache or Jikan)
     */
    async getAnimeByMalId(malId: number): Promise<Anime | null> {
        // Check cache first
        const { data: cached } = await (this.supabase
            .from('animes') as any)
            .select('*')
            .eq('mal_id', malId)
            .single();

        if (cached) {
            const cacheAge = Date.now() - new Date(cached.cached_at).getTime();
            if (cacheAge < CACHE_DURATION_MS) {
                return cached;
            }
        }

        // Fetch from Jikan and cache
        return this.fetchAndCacheAnime(malId);
    }

    /**
     * Ensure an anime is cached (fetch if not exists or stale)
     */
    private async ensureAnimeCached(malId: number): Promise<Anime> {
        const { data: cached } = await (this.supabase
            .from('animes') as any)
            .select('*')
            .eq('mal_id', malId)
            .single();

        if (cached) {
            const cacheAge = Date.now() - new Date(cached.cached_at).getTime();
            if (cacheAge < CACHE_DURATION_MS) {
                return cached;
            }
        }

        return this.fetchAndCacheAnime(malId);
    }

    /**
     * Fetch anime from Jikan API and cache it
     */
    private async fetchAndCacheAnime(malId: number): Promise<Anime> {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch anime from Jikan: ${response.status}`);
        }

        const result = await response.json();
        const jikanAnime: JikanAnime = result.data;

        const animeData: AnimeInsert = {
            mal_id: jikanAnime.mal_id,
            title: jikanAnime.title,
            title_english: jikanAnime.title_english,
            title_japanese: jikanAnime.title_japanese,
            synopsis: jikanAnime.synopsis,
            type: jikanAnime.type,
            status: jikanAnime.status,
            episodes: jikanAnime.episodes,
            duration: jikanAnime.duration,
            score: jikanAnime.score,
            rank: jikanAnime.rank,
            popularity: jikanAnime.popularity,
            season: jikanAnime.season,
            year: jikanAnime.year,
            source: jikanAnime.source,
            rating: jikanAnime.rating,
            images: jikanAnime.images as any,
            genres: jikanAnime.genres || [],
            themes: jikanAnime.themes || [],
            demographics: jikanAnime.demographics || [],
            studios: jikanAnime.studios || [],
            aired: jikanAnime.aired as any,
            cached_at: new Date().toISOString(),
        };

        const { data, error } = await (this.supabase
            .from('animes') as any)
            .upsert(animeData)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to cache anime: ${error.message}`);
        }

        return data;
    }

    /**
     * Get comparison between two users' anime lists
     */
    async getComparison(otherUserId: string): Promise<{
        common: UserAnimeDetails[];
        onlyMe: UserAnimeDetails[];
        onlyThem: UserAnimeDetails[];
    }> {
        // Get both users' anime lists
        const [myList, theirList] = await Promise.all([
            (this.supabase
                .from('user_anime_details') as any)
                .select('*')
                .eq('user_id', this.userId!),
            (this.supabase
                .from('user_anime_details') as any)
                .select('*')
                .eq('user_id', otherUserId),
        ]);

        const myAnimes = (myList.data || []) as UserAnimeDetails[];
        const theirAnimes = (theirList.data || []) as UserAnimeDetails[];

        const myMalIds = new Set(myAnimes.map(a => a.mal_id));
        const theirMalIds = new Set(theirAnimes.map(a => a.mal_id));

        return {
            common: myAnimes.filter(a => theirMalIds.has(a.mal_id)),
            onlyMe: myAnimes.filter(a => !theirMalIds.has(a.mal_id)),
            onlyThem: theirAnimes.filter(a => !myMalIds.has(a.mal_id)),
        };
    }
}

/**
 * Factory function to create AnimeService instance
 */
export function createAnimeService(
    supabase: SupabaseClient<Database>,
    userId?: string
): AnimeService {
    return new AnimeService(supabase, userId);
}
