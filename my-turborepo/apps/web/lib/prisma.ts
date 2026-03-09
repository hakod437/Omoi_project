/**
 * Prisma Client Singleton
 * 
 * Singleton pattern for Prisma client to avoid multiple instances
 * 
 * @module lib/prisma
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL
    }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'info'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    logger.info('Prisma client disconnected');
});
