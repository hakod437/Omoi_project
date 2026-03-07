import prisma from '@/lib/prisma';
import { calculateGlobalScore, getTierFromScore } from '@/lib/scoring';
import { Tier } from '@/types/anime';
import { ServiceResponse } from '@/types/service';

export interface RatingInput {
    userId: string;
    animeId: string;
    malId: number;
    title: string;
    imageUrl?: string;
    genres: string[];
    animTier: Tier;
    scenTier: Tier;
    musicTier: Tier;
    review?: string;
}

export class RatingService {
    static async upsertRating(input: RatingInput): Promise<ServiceResponse<any>> {
        try {
            const globalScore = calculateGlobalScore(
                input.animTier,
                input.scenTier,
                input.musicTier
            );
            const globalTier = getTierFromScore(globalScore);

            // 1. Ensure Anime exists
            await prisma.anime.upsert({
                where: { id: input.animeId },
                update: {},
                create: {
                    id: input.animeId,
                    malId: input.malId,
                    title: input.title,
                    imageUrl: input.imageUrl,
                    genres: Array.isArray(input.genres) ? input.genres.join(',') : input.genres,
                },
            });

            // 2. Upsert Rating
            const rating = await prisma.rating.upsert({
                where: {
                    userId_animeId: {
                        userId: input.userId,
                        animeId: input.animeId,
                    },
                },
                update: {
                    animTier: input.animTier,
                    scenTier: input.scenTier,
                    musicTier: input.musicTier,
                    globalScore,
                    globalTier,
                },
                create: {
                    userId: input.userId,
                    animeId: input.animeId,
                    animTier: input.animTier,
                    scenTier: input.scenTier,
                    musicTier: input.musicTier,
                    globalScore,
                    globalTier,
                },
            });

            // 3. Update Review if provided
            if (input.review) {
                await prisma.review.upsert({
                    where: { ratingId: rating.id },
                    update: { content: input.review },
                    create: {
                        content: input.review,
                        userId: input.userId,
                        animeId: input.animeId,
                        ratingId: rating.id,
                    },
                });
            }

            // 4. Update Anime averages
            await this.updateAnimeAverages(input.animeId);

            return { success: true, data: rating };
        } catch (error: any) {
            console.error('RatingService.upsertRating Error:', error);
            return { success: false, error: error.message || 'Failed to upsert rating' };
        }
    }

    private static async updateAnimeAverages(animeId: string) {
        const ratings = await prisma.rating.findMany({
            where: { animeId },
            select: { globalScore: true, animTier: true, scenTier: true, musicTier: true }
        });

        if (ratings.length === 0) return;

        const count = ratings.length;
        const TIER_MAP = { S: 10, A: 8, B: 6, C: 4, D: 2 };

        const avgGlobal = ratings.reduce((acc: number, r: any) => acc + r.globalScore, 0) / count;
        const avgAnim = ratings.reduce((acc: number, r: any) => acc + TIER_MAP[r.animTier as keyof typeof TIER_MAP], 0) / count;
        const avgScen = ratings.reduce((acc: number, r: any) => acc + TIER_MAP[r.scenTier as keyof typeof TIER_MAP], 0) / count;
        const avgMusic = ratings.reduce((acc: number, r: any) => acc + TIER_MAP[r.musicTier as keyof typeof TIER_MAP], 0) / count;

        await prisma.anime.update({
            where: { id: animeId },
            data: {
                avgGlobal,
                avgAnimTier: avgAnim,
                avgScenTier: avgScen,
                avgMusicTier: avgMusic,
                totalRatings: count,
            },
        });
    }

    static async getUserRatings(userId: string) {
        return prisma.rating.findMany({
            where: { userId },
            include: { anime: true },
            orderBy: { updatedAt: 'desc' }
        });
    }
}
