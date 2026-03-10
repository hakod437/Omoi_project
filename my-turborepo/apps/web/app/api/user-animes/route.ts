import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createRequestLogger } from '@/lib/logger';
import { getUserDashboardStats } from '@/lib/services/dashboard-stats.service';

interface UpsertUserAnimePayload {
    malId?: number;
    watched?: boolean;
    userRating?: number | null;
    animationRating?: number | null;
    userDescription?: string | null;
    title?: string;
}

function isValidRating(value: number | null | undefined): boolean {
    if (value === null || value === undefined) return true;
    return Number.isInteger(value) && value >= 1 && value <= 6;
}

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);
    const log = createRequestLogger(requestId, '/api/user-animes', 'POST');

    try {
        const session = await getServerSession(authOptions);
        const userId = (session?.user as { id?: string } | undefined)?.id;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: { message: 'Non authentifié' } },
                { status: 401 }
            );
        }

        const body = (await request.json()) as UpsertUserAnimePayload;
        const { malId, watched, userRating, animationRating, title } = body;

        if (!malId || !Number.isInteger(malId) || malId <= 0) {
            return NextResponse.json(
                { success: false, error: { message: 'malId invalide' } },
                { status: 400 }
            );
        }

        if (!isValidRating(userRating) || !isValidRating(animationRating)) {
            return NextResponse.json(
                { success: false, error: { message: 'Les notes doivent être comprises entre 1 et 6' } },
                { status: 400 }
            );
        }

        const animeTitle = title?.trim() || `Anime #${malId}`;
        let anime = await prisma.anime.findUnique({ where: { malId } });
        if (!anime) {
            anime = await prisma.anime.create({
                data: {
                    malId,
                    title: animeTitle,
                    genres: '[]',
                },
            });
        }

        const shouldMarkWatched =
            watched === true || (watched === undefined && (userRating !== null && userRating !== undefined));

        let userListEntry = null;
        if (shouldMarkWatched) {
            userListEntry = await prisma.userList.upsert({
                where: {
                    userId_animeId: {
                        userId,
                        animeId: anime.id,
                    },
                },
                update: {
                    status: 'COMPLETED',
                },
                create: {
                    userId,
                    animeId: anime.id,
                    status: 'COMPLETED',
                },
            });
        }

        let ratingEntry = null;
        if (userRating !== null && userRating !== undefined) {
            const tier = toTier(userRating);
            const subTier = toTier(animationRating ?? userRating);

            ratingEntry = await prisma.rating.upsert({
                where: {
                    userId_animeId: {
                        userId,
                        animeId: anime.id,
                    },
                },
                update: {
                    globalScore: userRating,
                    globalTier: tier,
                    animTier: subTier,
                    scenTier: subTier,
                    musicTier: subTier,
                },
                create: {
                    userId,
                    animeId: anime.id,
                    globalScore: userRating,
                    globalTier: tier,
                    animTier: subTier,
                    scenTier: subTier,
                    musicTier: subTier,
                },
            });
        }

        const stats = await getUserDashboardStats(userId);

        return NextResponse.json({
            success: true,
            data: {
                anime: {
                    id: anime.id,
                    malId: anime.malId,
                    title: anime.title,
                },
                watched: userListEntry
                    ? {
                          id: userListEntry.id,
                          status: userListEntry.status,
                      }
                    : null,
                rating: ratingEntry
                    ? {
                          id: ratingEntry.id,
                          globalScore: ratingEntry.globalScore,
                          globalTier: ratingEntry.globalTier,
                      }
                    : null,
                stats,
            },
            message: 'Anime mis à jour dans la liste utilisateur',
        });
    } catch (error) {
        log.error('Failed to upsert user anime', {
            error: error instanceof Error ? error.message : String(error),
        });

        return NextResponse.json(
            { success: false, error: { message: 'Erreur serveur interne' } },
            { status: 500 }
        );
    }
}

function toTier(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
    if (score >= 6) return 'S';
    if (score >= 5) return 'A';
    if (score >= 4) return 'B';
    if (score >= 3) return 'C';
    return 'D';
}
