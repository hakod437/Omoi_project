import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        // Use DIRECT_URL for schema operations when available, fallback to DATABASE_URL.
        url: process.env.DIRECT_URL || process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable",
    },
})
