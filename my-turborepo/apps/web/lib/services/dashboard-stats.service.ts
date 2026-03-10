import { prisma } from '@/lib/prisma';

export interface UserDashboardStats {
    totalWatched: number;
    totalRated: number;
    averageRating: number | null;
    lastActivityAt: string | null;
}

export async function getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
    const [
        totalWatched,
        totalRated,
        avgRating,
        latestWatchedEntry,
        latestRatingEntry,
    ] = await Promise.all([
        prisma.userList.count({
            where: {
                userId,
                status: 'COMPLETED',
            },
        }),
        prisma.rating.count({ where: { userId } }),
        prisma.rating.aggregate({
            where: { userId },
            _avg: { globalScore: true },
        }),
        prisma.userList.findFirst({
            where: {
                userId,
                status: 'COMPLETED',
            },
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true },
        }),
        prisma.rating.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true },
        }),
    ]);

    const lastActivityDate = [latestWatchedEntry?.updatedAt, latestRatingEntry?.updatedAt]
        .filter((date): date is Date => Boolean(date))
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    return {
        totalWatched,
        totalRated,
        averageRating: avgRating._avg.globalScore ?? null,
        lastActivityAt: lastActivityDate ? lastActivityDate.toISOString() : null,
    };
}
