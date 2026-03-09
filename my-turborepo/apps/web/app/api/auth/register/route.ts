/**
 * Register API Route
 * 
 * Handles user registration
 * 
 * @module api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger, createRequestLogger } from '@/lib/logger';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);
    const log = createRequestLogger(requestId, 'POST', '/api/auth/register');
    
    try {
        log.info('Registration attempt started');
        
        const body = await request.json();
        const { email, password, confirmPassword } = body;
        
        // Input validation
        if (!email || !password) {
            log.warn('Missing credentials', { email: !!email, password: !!password });
            return NextResponse.json(
                { success: false, error: { message: 'Email et mot de passe requis' } },
                { status: 400 }
            );
        }
        
        // Password confirmation check
        if (password !== confirmPassword) {
            log.warn('Password confirmation mismatch', { email });
            return NextResponse.json(
                { success: false, error: { message: 'Les mots de passe ne correspondent pas' } },
                { status: 400 }
            );
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            log.warn('Invalid email format', { email });
            return NextResponse.json(
                { success: false, error: { message: 'Format d\'email invalide' } },
                { status: 400 }
            );
        }
        
        log.info('Checking if user exists', { email });
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            log.warn('User already exists', { email });
            return NextResponse.json(
                { success: false, error: { message: 'Un compte existe déjà avec cet email' } },
                { status: 409 }
            );
        }
        
        log.info('Creating new user', { email });
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username: email.split('@')[0], // Use email prefix as username
                displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
            }
        });
        
        log.info('User created successfully', { userId: user.id, email });
        
        // Create JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                displayName: user.displayName 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        log.info('Registration successful', { userId: user.id, email });
        
        return NextResponse.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token
            },
            message: 'Compte créé avec succès'
        }, { status: 201 });
        
    } catch (error) {
        log.error('Registration error', { error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined });
        return NextResponse.json(
            { success: false, error: { message: 'Erreur serveur interne' } },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        message: 'Register endpoint - POST for user registration',
        timestamp: new Date().toISOString()
    });
}
