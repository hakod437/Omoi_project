import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Lazy initialization: PrismaClient is NOT created at module evaluation time.
// This prevents build-time crashes when Turbopack evaluates server modules.
function getPrismaClient(): PrismaClient {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient()
    }
    return globalForPrisma.prisma
}

// Use a Proxy so that any property access on `prisma` triggers lazy init
const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
        const client = getPrismaClient()
        return (client as any)[prop]
    },
})

export default prisma
