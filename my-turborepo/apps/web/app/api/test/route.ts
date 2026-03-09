/**
 * Test API Route
 * 
 * Endpoint for testing authentication and form submissions
 * 
 * @module api/test
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Simulate authentication validation
        const { email, password, confirmPassword } = body;
        
        // Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: { message: 'Email et mot de passe requis' } },
                { status: 400 }
            );
        }
        
        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: { message: 'Le mot de passe doit faire au moins 8 caractères' } },
                { status: 400 }
            );
        }
        
        if (confirmPassword && password !== confirmPassword) {
            return NextResponse.json(
                { success: false, error: { message: 'Les mots de passe ne correspondent pas' } },
                { status: 400 }
            );
        }
        
        // Simulate successful authentication
        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: 'test-user-123',
                    email: email,
                    displayName: 'Test User',
                    avatarUrl: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                token: 'mock-jwt-token-12345'
            },
            message: 'Connexion réussie (simulation)'
        });
        
    } catch (error) {
        return NextResponse.json(
            { success: false, error: { message: 'Erreur serveur' } },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'API Test endpoint - POST for authentication testing',
        timestamp: new Date().toISOString()
    });
}
