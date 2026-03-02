import { NextRequest, NextResponse } from 'next/server';
import { AnimeService } from '@/services/anime.service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('q');
    if (!query) return NextResponse.json([], { status: 400 });

    const result = await AnimeService.search(query);
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
}
