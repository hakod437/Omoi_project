/**
 * Animes API Route
 * 
 * Handles anime CRUD operations
 * 
 * @module api/animes
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger, createRequestLogger } from '@/lib/logger';

export async function GET(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);
    const log = createRequestLogger(requestId, 'GET', '/api/animes');
    
    try {
        log.info('Fetching animes list');
        
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');
        const search = searchParams.get('search') || '';
        
        log.info('Query parameters', { limit, offset, search });
        
        const where = search ? {
            OR: [
                { title: { contains: search } },
                { titleEnglish: { contains: search } }
            ]
        } : {};
        
        const animes = await prisma.anime.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' }
        });
        
        const total = await prisma.anime.count({ where });
        
        log.info('Animes fetched successfully', { count: animes.length, total });
        
        return NextResponse.json({
            success: true,
            data: {
                animes,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total
                }
            },
            message: `${animes.length} animes trouvés`
        });
        
    } catch (error) {
        log.error('Error fetching animes', { error: error.message, stack: error.stack });
        return NextResponse.json(
            { success: false, error: { message: 'Erreur serveur interne' } },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const requestId = Math.random().toString(36).substring(7);
    const log = createRequestLogger(requestId, 'POST', '/api/animes');
    
    try {
        log.info('Creating new anime');
        
        const body = await request.json();
        const { malId, title, titleEnglish, synopsis, imageUrl, episodes, year, genres } = body;
        
        // Validation
        if (!malId || !title) {
            log.warn('Missing required fields', { malId: !!malId, title: !!title });
            return NextResponse.json(
                { success: false, error: { message: 'malId et title requis' } },
                { status: 400 }
            );
        }
        
        // Check if anime already exists
        const existingAnime = await prisma.anime.findUnique({
            where: { malId }
        });
        
        if (existingAnime) {
            log.warn('Anime already exists', { malId });
            return NextResponse.json(
                { success: false, error: { message: 'Anime existe déjà' } },
                { status: 409 }
            );
        }
        
        const anime = await prisma.anime.create({
            data: {
                malId,
                title,
                titleEnglish,
                synopsis,
                imageUrl,
                episodes,
                year,
                genres: genres || ''
            }
        });
        
        log.info('Anime created successfully', { malId, title, id: anime.id });
        
        return NextResponse.json({
            success: true,
            data: anime,
            message: 'Anime créé avec succès'
        }, { status: 201 });
        
    } catch (error) {
        log.error('Error creating anime', { error: error.message, stack: error.stack });
        return NextResponse.json(
            { success: false, error: { message: 'Erreur serveur interne' } },
            { status: 500 }
        );
    }
}
