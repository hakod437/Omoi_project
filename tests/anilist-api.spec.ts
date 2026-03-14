import { test, expect } from '@playwright/test'

const testPhone = '0123456789'
const testPassword = 'password123'

test.describe('AniList API Contracts', () => {
  test.describe.configure({ mode: 'serial' })

  test('should return 400 for too-short anime search query', async ({ request }) => {
    const response = await request.get('/api/anime/search?q=a')
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body?.state).toBe('error')
    expect(typeof body?.error).toBe('string')
  })

  test('should return a valid envelope for anime search query', async ({ request }) => {
    const response = await request.get('/api/anime/search?q=naruto&perPage=3')
    expect([200, 429, 500]).toContain(response.status())

    const body = await response.json()
    expect(['success', 'rate_limited', 'error']).toContain(body?.state)

    if (body?.state === 'success') {
      expect(Array.isArray(body?.data?.media)).toBeTruthy()
      expect(typeof body?.data?.pageInfo?.hasNextPage).toBe('boolean')
    }

    if (body?.state === 'rate_limited') {
      expect(response.status()).toBe(429)
    }
  })

  test('should require auth for /api/me and /api/me/list when unauthenticated', async ({ request }) => {
    const meResponse = await request.get('/api/me')
    const meListResponse = await request.get('/api/me/list')

    expect(meResponse.status()).toBe(401)
    expect(meListResponse.status()).toBe(401)

    const meBody = await meResponse.json()
    const meListBody = await meListResponse.json()

    expect(meBody?.state).toBe('auth_required')
    expect(meListBody?.state).toBe('auth_required')
  })

  test('should return a valid authenticated envelope for /api/me and /api/me/list', async ({ page }) => {
    await page.goto('/login?mode=login')
    await page.fill('input[name="phoneNumber"]', testPhone)
    await page.fill('input[name="password"]', testPassword)
    await page.click('button[type="submit"]')

    await expect(page.locator('text=/Okaeri/i')).toBeVisible({ timeout: 45000 })

    const mePayload = await page.evaluate(async () => {
      const response = await fetch('/api/me')
      const body = await response.json()
      return { status: response.status, body }
    })

    expect([200, 401, 429]).toContain(mePayload.status)
    expect(['success', 'auth_required', 'partial', 'rate_limited']).toContain(mePayload.body?.state)

    if (mePayload.body?.state === 'success') {
      expect(mePayload.body?.data?.viewer?.id).toBeTruthy()
      expect(mePayload.body?.source).toBe('anilist')
    }

    if (mePayload.body?.state === 'auth_required') {
      expect(mePayload.body?.requiresAniListLogin).toBeTruthy()
      expect(mePayload.body?.data?.localUser?.id).toBeTruthy()
    }

    const listPayload = await page.evaluate(async () => {
      const response = await fetch('/api/me/list')
      const body = await response.json()
      return { status: response.status, body }
    })

    expect([200, 401, 429]).toContain(listPayload.status)
    expect(['success', 'auth_required', 'partial', 'rate_limited']).toContain(listPayload.body?.state)

    if (listPayload.body?.state === 'success') {
      expect(Array.isArray(listPayload.body?.data?.entries)).toBeTruthy()
      expect(Array.isArray(listPayload.body?.data?.localList)).toBeTruthy()
    }

    if (listPayload.body?.state === 'auth_required') {
      expect(listPayload.body?.requiresAniListLogin).toBeTruthy()
      expect(Array.isArray(listPayload.body?.data?.list)).toBeTruthy()
    }

    if (listPayload.body?.state === 'partial' || listPayload.body?.state === 'rate_limited') {
      expect(Array.isArray(listPayload.body?.data?.list)).toBeTruthy()
    }
  })
})
