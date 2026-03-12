import { test, expect } from '@playwright/test'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
const isSupabaseHost = connectionString && (connectionString.includes('supabase.com') || connectionString.includes('supabase.co'))

const pool = new Pool({
    connectionString,
    ...(isSupabaseHost ? { ssl: { rejectUnauthorized: false } } : {}),
})

const testPhone = '0123456789'
const testPassword = 'password123'

test.describe('Admin Role Session', () => {
    test.describe.configure({ mode: 'serial' })

    test.beforeAll(async () => {
        const { rows } = await pool.query(
            'select role from "User" where "phoneNumber" = $1 limit 1',
            [testPhone]
        )

        if (!rows[0]) {
            throw new Error('Test user not found for admin role test')
        }

        await pool.query(
            'update "User" set role = $1 where "phoneNumber" = $2',
            ['ADMIN', testPhone]
        )
    })

    test.afterAll(async () => {
        await pool.end()
    })

    test('should expose ADMIN role in authenticated session', async ({ page }) => {
        test.setTimeout(90000)

        await page.goto('/login?mode=login')
        await page.fill('input[name="phoneNumber"]', testPhone)
        await page.fill('input[name="password"]', testPassword)
        await page.click('button[type="submit"]')

        await expect(page.locator('text=/Okaeri/i')).toBeVisible({ timeout: 45000 })

        const session = await page.evaluate(async () => {
            const response = await fetch('/api/auth/session')
            return response.json()
        })

        expect(session?.user?.id).toBeTruthy()
        expect(session?.user?.role).toBe('ADMIN')
    })
})