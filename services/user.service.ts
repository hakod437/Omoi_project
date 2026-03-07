import prisma from '@/lib/prisma';
import { calculateCompatibility } from '@/lib/scoring';
import { ServiceResponse } from '@/types/service';

export class UserService {
    static async searchUsers(query: string, excludeUserId?: string): Promise<ServiceResponse<any[]>> {
        try {
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: query } },
                        { displayName: { contains: query } },
                    ],
                    NOT: excludeUserId ? { id: excludeUserId } : undefined
                },
                select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true,
                },
                take: 10
            });
            return { success: true, data: users };
        } catch (error: any) {
            console.error('UserService.searchUsers Error:', error);
            return { success: false, error: 'Failed to search users' };
        }
    }

    static async compareUsers(userAId: string, userBId: string): Promise<ServiceResponse<any>> {
        try {
            const [userARatings, userBRatings] = await Promise.all([
                prisma.rating.findMany({ where: { userId: userAId } }),
                prisma.rating.findMany({ where: { userId: userBId } }),
            ]);

            const userAMap = new Map(userARatings.map((r: any) => [r.animeId, r.globalTier]));
            const commonAnimes: string[] = [];
            const tiersA: any[] = [];
            const tiersB: any[] = [];

            for (const rB of userBRatings) {
                if (userAMap.has(rB.animeId)) {
                    commonAnimes.push(rB.animeId);
                    tiersA.push(userAMap.get(rB.animeId));
                    tiersB.push(rB.globalTier);
                }
            }

            if (commonAnimes.length === 0) {
                return {
                    success: true,
                    data: {
                        compatibility: 0,
                        commonCount: 0,
                        message: 'No common animes found!'
                    }
                };
            }

            const compatibility = calculateCompatibility(tiersA, tiersB);

            const commonAnimesSerialized = JSON.stringify(commonAnimes);

            // Upsert comparison
            const comparison = await prisma.comparison.upsert({
                where: {
                    userAId_userBId: { userAId, userBId }
                },
                update: { compatibility, commonAnimes: commonAnimesSerialized },
                create: { userAId, userBId, compatibility, commonAnimes: commonAnimesSerialized }
            });

            return {
                success: true,
                data: {
                    compatibility,
                    commonCount: commonAnimes.length,
                    commonAnimes,
                    comparisonId: comparison.id
                }
            };
        } catch (error: any) {
            console.error('UserService.compareUsers Error:', error);
            return { success: false, error: 'Failed to compare users' };
        }
    }
}
