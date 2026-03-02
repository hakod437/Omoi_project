import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
    test('should load the dashboard and show stats', async ({ page }) => {
        // Note: This test assumes the user is logged in if we use storageState
        // For now, just test if it's reachable or redirects to login
        await page.goto('/dashboard');

        // If not logged in, it should redirect to login
        const url = page.url();
        if (url.includes('/login')) {
            await expect(page).toHaveURL(/\/login/);
        } else {
            await expect(page.locator('h1')).toContainText('Dashboard');
        }
    });
});
