import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    void req
    return NextResponse.json({ error: 'Backend disabled (frontend-only mode)' }, { status: 410 });
}
