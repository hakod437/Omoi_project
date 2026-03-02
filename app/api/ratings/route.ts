import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { RatingService } from '@/services/rating.service';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const RatingSchema = z.object({
    animeId: z.string().min(1),
    malId: z.number().int(),
    title: z.string(),
    imageUrl: z.string().optional(),
    genres: z.array(z.string()),
    animTier: z.enum(['S', 'A', 'B', 'C', 'D']),
    scenTier: z.enum(['S', 'A', 'B', 'C', 'D']),
    musicTier: z.enum(['S', 'A', 'B', 'C', 'D']),
    review: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validated = RatingSchema.parse(body);

        const result = await RatingService.upsertRating({
            ...validated,
            userId: session.user.id
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result.data);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
