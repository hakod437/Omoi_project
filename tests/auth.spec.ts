import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.describe.configure({ mode: 'serial' });
    const testPhone = '0123456789';
    const testPassword = 'password123';

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should show Omoi branding on landing page', async ({ page }) => {
        await expect(page.locator('text=Omoi').first()).toBeVisible();
        await expect(page.locator('text=Omoi 2.0').first()).toBeVisible();
    });

    test('should NOT show hero buttons on landing page', async ({ page }) => {
        await expect(page.locator('button:has-text("Commencer gratis")')).not.toBeVisible();
        await expect(page.locator('button:has-text("Voir la démo")')).not.toBeVisible();
    });

    test('should switch between Login and Join modes in Navbar', async ({ page }) => {
        await page.goto('/login?mode=login');
        await expect(page.locator('h1')).toContainText('Bon retour');

        await page.locator('nav >> text=Join').click();
        await expect(page.locator('h1')).toContainText('Rejoindre Omoi');

        await page.locator('nav >> text=Login').click();
        await expect(page.locator('h1')).toContainText('Bon retour');
    });

    test('should register a test user if not exists', async ({ page }) => {
        await page.goto('/login?mode=register');
        await page.fill('input[name="username"]', 'testuser');
        await page.fill('input[name="phoneNumber"]', testPhone);
        await page.fill('input[name="password"]', testPassword);

        await page.click('button[type="submit"]');

        // Wait for EITHER success OR "already exists" error
        const feedback = page.locator('text=/Compte créé|déjà|identifiants/i').first();
        await expect(feedback).toBeVisible({ timeout: 15000 });
    });

    test('should login and redirect to dashboard', async ({ page }) => {
        test.setTimeout(60000); // Dashboard SSR can take 20s+

        console.log('[Test:login] Navigating to /login?mode=login');
        await page.goto('/login?mode=login');

        console.log('[Test:login] Filling form...');
        await page.fill('input[name="phoneNumber"]', testPhone);
        await page.fill('input[name="password"]', testPassword);

        console.log('[Test:login] Submitting...');
        await page.click('button[type="submit"]');

        console.log('[Test:login] Waiting for dashboard redirect...');

        // Wait for redirect to dashboard - check for Okaeri greeting (Dashboard unique)
        // Dashboard SSR is slow due to Prisma queries, allow up to 45s
        await expect(page.locator('text=/Okaeri/i')).toBeVisible({ timeout: 45000 });
        console.log('[Test:login] Dashboard loaded! URL:', page.url());
        expect(page.url()).toContain('/dashboard');
    });

    test('should redirect authenticated user from / to /dashboard', async ({ page }) => {
        test.setTimeout(90000); // Two dashboard loads

        // Log in first
        console.log('[Test:redirect] Logging in...');
        await page.goto('/login?mode=login');
        await page.fill('input[name="phoneNumber"]', testPhone);
        await page.fill('input[name="password"]', testPassword);
        await page.click('button[type="submit"]');

        await expect(page.locator('text=/Okaeri/i')).toBeVisible({ timeout: 45000 });
        console.log('[Test:redirect] Dashboard loaded after login');

        // Try to go to landing page
        console.log('[Test:redirect] Navigating to / ...');
        await page.goto('/');

        // Should be redirected back to dashboard
        await expect(page.locator('text=/Okaeri/i')).toBeVisible({ timeout: 45000 });
        console.log('[Test:redirect] Redirected to dashboard! URL:', page.url());
        expect(page.url()).toContain('/dashboard');
    });
});
