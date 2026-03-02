import { test, expect } from '@playwright/test';

test.describe('Anime Exploration', () => {
    test('should search for an anime and view details', async ({ page }) => {
        await page.goto('/');

        // Search for Naruto
        await page.fill('input[placeholder*="Search"]', 'Naruto');
        await page.keyboard.press('Enter');

        // Wait for results
        await page.waitForSelector('text=Naruto');

        // Click on the first result
        await page.click('text=Naruto');

        // Verify detail page
        await expect(page).toHaveURL(/\/anime\/\d+/);
        await expect(page.locator('h1')).toContainText('Naruto');
    });
});
