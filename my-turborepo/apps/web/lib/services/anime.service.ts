/**
 * Anime Service
 * 
 * Business logic for anime-related operations.
 * Handles CRUD operations, Jikan API integration, and caching.
 * 
 * @module lib/services/anime.service
 */

import { PrismaClient } from '@prisma/client';
import type { Database, Anime, UserAnimeRating } from '@/types/database';
import { JikanAnime } from '@/types';
import { logger, createRequestLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

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
    limit?: number;
    offset?: number;
    search?: string;
    genre?: string;
    season?: string;
    year?: number;
}

/**
 * Get anime by MAL ID
 */
export async function getAnimeByMalId(malId: number): Promise<Anime | null> {
    const log = createRequestLogger('get-anime', 'GET', `/animes/${malId}`);
    
    try {
        log.info('Fetching anime by MAL ID', { malId });
        
        const anime = await prisma.anime.findUnique({
            where: { malId }
        });
        
        if (anime) {
            log.info('Anime found successfully', { malId, title: anime.title });
        } else {
            log.warn('Anime not found', { malId });
        }
        
        return anime;
    } catch (error) {
        log.error('Error fetching anime by MAL ID', { malId, error: error.message });
        throw error;
    }
}

/**
 * Add anime to user's list
 */
export async function addAnimeToList(userId: string, input: AddAnimeInput): Promise<UserAnimeRating> {
    const log = createRequestLogger('add-anime', 'POST', '/user-anime-ratings');
    
    try {
        log.info('Adding anime to user list', { userId, malId: input.malId });
        
        // Check if anime exists in database, if not fetch from Jikan
        let anime = await prisma.anime.findUnique({
            where: { malId: input.malId }
        });
        
        if (!anime) {
            log.info('Anime not found in DB, fetching from Jikan API', { malId: input.malId });
            // TODO: Implement Jikan API call
            throw new Error('Anime not found in database. Please cache it first.');
        }
        
        // Check if user already has this anime
        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_animeId: {
                    userId,
                    animeId: (await prisma.anime.findUnique({ where: { malId: input.malId } }))?.id || ''
                }
            }
        });
        
        if (existingRating) {
            log.warn('User already has this anime in their list', { userId, malId: input.malId });
            throw new Error('Anime already in user list');
        }
        
        const animeRecord = await prisma.anime.findUnique({ where: { malId: input.malId } });
        if (!animeRecord) {
            throw new Error('Anime not found in database');
        }
        
        const userAnime = await prisma.rating.create({
            data: {
                userId,
                animeId: animeRecord.id,
                animTier: 'A' as any, // TODO: Calculate from input.animationRating
                scenTier: 'A' as any, // TODO: Calculate from input.animationRating
                musicTier: 'A' as any, // TODO: Calculate from input.animationRating
                globalScore: input.userRating,
                globalTier: 'A' as any // TODO: Calculate from input.userRating
            }
        });
        
        log.info('Successfully added anime to user list', { 
            userId, 
            malId: input.malId, 
            userRating: input.userRating,
            animationRating: input.animationRating 
        });
        
        return {
            ...userAnime,
            malId: input.malId // Add malId for compatibility
        };
    } catch (error) {
        log.error('Error adding anime to user list', { 
            userId, 
            malId: input.malId, 
            error: error.message 
        });
        throw error;
    }
}

/**
 * Update anime in user's list
 */
export async function updateAnimeInList(userId: string, malId: number, input: UpdateAnimeInput): Promise<UserAnimeRating> {
    // TODO: Implement with Prisma
    // const userAnime = await prisma.userAnimeRating.update({
    //     where: {
    //         userId_malId: {
    //             userId,
    //             malId
    //         }
    //     },
    //     data: input
    // });
    // return userAnime;
    
    throw new Error('Not implemented - needs Prisma integration');
}

/**
 * Remove anime from user's list
 */
export async function removeAnimeFromList(userId: string, malId: number): Promise<void> {
    // TODO: Implement with Prisma
    // await prisma.userAnimeRating.delete({
    //     where: {
    //         userId_malId: {
    //             userId,
    //             malId
    //         }
    //     }
    // });
    
    throw new Error('Not implemented - needs Prisma integration');
}

/**
 * Get user's anime list
 */
export async function getUserAnimeList(userId: string, options?: AnimeListOptions): Promise<UserAnimeRating[]> {
    // TODO: Implement with Prisma
    // const userAnimes = await prisma.userAnimeRating.findMany({
    //     where: { userId },
    //     include: { anime: true },
    //     ...options
    // });
    // return userAnimes;
    
    return [];
}

/**
 * Search anime from Jikan API
 */
export async function searchAnime(query: string, options?: AnimeListOptions): Promise<JikanAnime[]> {
    // TODO: Implement Jikan API integration
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=${options?.limit || 10}`);
    const data = await response.json();
    
    return data.data || [];
}

/**
 * Cache anime data from Jikan API
 */
export async function cacheAnimeData(anime: JikanAnime): Promise<Anime> {
    // TODO: Implement with Prisma
    // const cachedAnime = await prisma.anime.upsert({
    //     where: { malId: anime.mal_id },
    //     update: {
    //         title: anime.title,
    //         titleEnglish: anime.title_english,
    //         titleJapanese: anime.title_japanese,
    //         synopsis: anime.synopsis,
    //         type: anime.type,
    //         status: anime.status,
    //         episodes: anime.episodes,
    //         duration: anime.duration,
    //         score: anime.score,
    //         rank: anime.rank,
    //         popularity: anime.popularity,
    //         season: anime.season,
    //         year: anime.year,
    //         source: anime.source,
    //         rating: anime.rating,
    //         images: anime.images,
    //         genres: anime.genres,
    //         themes: anime.themes,
    //         demographics: anime.demographics,
    //         studios: anime.studios,
    //         aired: anime.aired,
    //         cachedAt: new Date().toISOString()
    //     },
    //     create: {
    //         malId: anime.mal_id,
    //         title: anime.title,
    //         titleEnglish: anime.title_english,
    //         titleJapanese: anime.title_japanese,
    //         synopsis: anime.synopsis,
    //         type: anime.type,
    //         status: anime.status,
    //         episodes: anime.episodes,
    //         duration: anime.duration,
    //         score: anime.score,
    //         rank: anime.rank,
    //         popularity: anime.popularity,
    //         season: anime.season,
    //         year: anime.year,
    //         source: anime.source,
    //         rating: anime.rating,
    //         images: anime.images,
    //         genres: anime.genres,
    //         themes: anime.themes,
    //         demographics: anime.demographics,
    //         studios: anime.studios,
    //         aired: anime.aired,
    //         cachedAt: new Date().toISOString()
    //     }
    // });
    // return cachedAnime;
    
    throw new Error('Not implemented - needs Prisma integration');
}
