/**
 * Database Seed
 * 
 * Populates the database with initial test data
 * 
 * @module lib/seed
 */

import { PrismaClient, Tier } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from './logger';
import { prisma } from './prisma';

async function main() {
    logger.info('Starting database seeding...');
    
    try {
        // Clean existing data
        await prisma.rating.deleteMany();
        await prisma.anime.deleteMany();
        await prisma.user.deleteMany();
        
        logger.info('Cleared existing data');
        
        // Create test users
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const testUser = await prisma.user.create({
            data: {
                email: 'test@example.com',
                username: 'testuser',
                displayName: 'Test User',
                password: hashedPassword,
                bio: 'Utilisateur de test pour AnimeVault'
            }
        });
        
        const testUserWithPhone = await prisma.user.create({
            data: {
                email: 'testphone@example.com',
                username: 'testphone',
                displayName: 'Test Phone User',
                password: hashedPassword,
                bio: 'Utilisateur de test avec numéro de téléphone pour NextAuth.js',
                phoneNumber: '1111'
            }
        });
        
        const adminUser = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                username: 'admin',
                displayName: 'Admin User',
                password: hashedPassword,
                bio: 'Administrateur de AnimeVault'
            }
        });
        
        logger.info('Created test users', { 
            testUserId: testUser.id,
            testUserWithPhoneId: testUserWithPhone.id, 
            adminUserId: adminUser.id 
        });
        
        // Create test animes
        const testAnimes = [
            {
                malId: 5114,
                title: 'Fullmetal Alchemist: Brotherhood',
                titleEnglish: 'Fullmetal Alchemist: Brotherhood',
                synopsis: 'Two brothers search for a philosopher stone after an attempt to revive their mother goes awry.',
                imageUrl: 'https://cdn.myanimelist.net/images/anime/5114.jpg',
                episodes: 64,
                year: 2009,
                season: 'Fall',
                studio: 'Bones',
                genres: 'Action,Adventure,Drama,Fantasy',
                malScore: 9.0,
                avgGlobal: 8.5,
                avgAnimTier: 8.2,
                avgScenTier: 8.7,
                avgMusicTier: 8.8,
                totalRatings: 150
            },
            {
                malId: 28977,
                title: 'Gintama°',
                titleEnglish: 'Gintama',
                synopsis: 'In an era where aliens have invaded Earth, Gintoki Sakata lives an ordinary life down on his luck.',
                imageUrl: 'https://cdn.myanimelist.net/images/anime/28977.jpg',
                episodes: 201,
                year: 2006,
                season: 'Spring',
                studio: 'Sunrise',
                genres: 'Action,Comedy,Historical,Parody,Samurai,Sci-Fi',
                malScore: 8.8,
                avgGlobal: 8.2,
                avgAnimTier: 8.5,
                avgScenTier: 8.0,
                avgMusicTier: 8.1,
                totalRatings: 200
            },
            {
                malId: 32281,
                title: 'Kimi no Na wa',
                titleEnglish: 'Your Name',
                synopsis: 'Mitsuha Miyamizu, a high school girl, wants to live a different life.',
                imageUrl: 'https://cdn.myanimelist.net/images/anime/32281.jpg',
                episodes: 1,
                year: 2016,
                season: 'Summer',
                studio: 'Kyoto Animation',
                genres: 'Drama,Romance,School,Supernatural',
                malScore: 8.4,
                avgGlobal: 8.0,
                avgAnimTier: 8.2,
                avgScenTier: 7.8,
                avgMusicTier: 8.5,
                totalRatings: 120
            }
        ];
        
        const createdAnimes = await prisma.anime.createMany({
            data: testAnimes
        });
        
        logger.info('Created test animes', { count: createdAnimes.count });
        
        // Create test ratings
        const testRatings = [
            {
                userId: testUser.id,
                animeId: (await prisma.anime.findFirst({ where: { malId: 5114 } }))!.id,
                animTier: Tier.S,
                scenTier: Tier.A,
                musicTier: Tier.S,
                globalScore: 9.5,
                globalTier: Tier.S
            },
            {
                userId: testUser.id,
                animeId: (await prisma.anime.findFirst({ where: { malId: 28977 } }))!.id,
                animTier: Tier.A,
                scenTier: Tier.S,
                musicTier: Tier.A,
                globalScore: 8.8,
                globalTier: Tier.A
            },
            {
                userId: adminUser.id,
                animeId: (await prisma.anime.findFirst({ where: { malId: 32281 } }))!.id,
                animTier: Tier.S,
                scenTier: Tier.S,
                musicTier: Tier.A,
                globalScore: 9.2,
                globalTier: Tier.S
            }
        ];
        
        const createdRatings = await prisma.rating.createMany({
            data: testRatings
        });
        
        logger.info('Created test ratings', { count: createdRatings.count });
        
        logger.info('Database seeding completed successfully!', {
            users: 2,
            animes: 3,
            ratings: 3
        });
        
    } catch (error) {
        logger.error('Error during database seeding', { 
            error: error instanceof Error ? error.message : String(error), 
            stack: error instanceof Error ? error.stack : undefined 
        });
        throw error;
    } finally {
        await prisma.$disconnect();
        logger.info('Prisma client disconnected');
    }
}

main()
    .catch((e) => {
        logger.error('Failed to seed database', { error: e.message });
        process.exit(1);
    });
