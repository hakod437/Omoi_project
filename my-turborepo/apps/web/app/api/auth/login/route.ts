/**
 * DEPRECATED: This route is replaced by NextAuth.js
 * The authentication is now handled by /api/auth/[...nextauth]
 */

import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        success: false,
        error: { message: 'Authentication moved to NextAuth.js' },
        redirect: '/api/auth/signin'
    }, { status: 410 }); // Gone
}

export async function GET() {
    return NextResponse.json({
        success: false,
        message: 'Authentication moved to NextAuth.js - use /api/auth/[...nextauth]',
        deprecated: true
    });
}
