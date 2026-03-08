import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Ensure environment variables are loaded
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const connectionString = process.env.DATABASE_URL;
console.log("[Prisma] Initializing pool with DATABASE_URL:", connectionString?.substring(0, 30) + "...");
const pool = new Pool({
    connectionString,
    // Prevent "Connection terminated unexpectedly" during long SSR renders
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
});
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
