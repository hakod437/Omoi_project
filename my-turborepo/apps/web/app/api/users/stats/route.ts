import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createRequestLogger } from '@/lib/logger';
import { getUserDashboardStats } from '@/lib/services/dashboard-stats.service';

export async function GET() {
    const requestId = Math.random().toString(36).substring(7);
    const log = createRequestLogger(requestId, '/api/users/stats', 'GET');

    try {
        const session = await getServerSession(authOptions);
        const userId = (session?.user as { id?: string } | undefined)?.id;

        if (!userId) {
            log.warn('Unauthorized stats access');
            return NextResponse.json(
                { success: false, error: { message: 'Non authentifié' } },
                { status: 401 }
            );
        }

        const stats = await getUserDashboardStats(userId);
        log.info('User stats fetched', { userId, stats });

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        log.error('Failed to fetch user stats', {
            error: error instanceof Error ? error.message : String(error),
        });

        return NextResponse.json(
            { success: false, error: { message: 'Erreur serveur interne' } },
            { status: 500 }
        );
    }
}
