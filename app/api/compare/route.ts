import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { UserService } from '@/services/user.service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { targetUserId } = await req.json();
        if (!targetUserId) throw new Error('Target User ID is required');

        const result = await UserService.compareUsers(session.user.id, targetUserId);
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result.data);
    } catch (error: any) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
