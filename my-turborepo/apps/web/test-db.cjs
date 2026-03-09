/**
 * Simple Database Connection Test
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

async function testConnection() {
    console.log('🔍 Testing database connection...');
    
    try {
        const prisma = new PrismaClient({
            adapter: new PrismaPg({
                connectionString: process.env.DATABASE_URL
            }),
            log: ['query', 'info', 'error']
        });
        
        console.log('✅ Prisma client created');
        
        // Test simple query
        const result = await prisma.user.findMany();
        console.log(`✅ Database connection successful! Found ${result.length} users`);
        
        await prisma.$disconnect();
        console.log('✅ Prisma client disconnected');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
