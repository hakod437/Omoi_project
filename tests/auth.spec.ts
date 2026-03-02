import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should allow user to register and then log in', async ({ page }) => {
        // Generate a unique phone number for testing
        const phoneNumber = `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        const username = `testuser_${Date.now()}`;
        const password = 'password123';

        // Step 1: Register
        await page.goto('/register');
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');

        // Should redirect to login with success message (or just check URL)
        await expect(page).toHaveURL(/\/login/);

        // Step 2: Login
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');

        // Should redirect to home or dashboard
        await expect(page).toHaveURL('/');

        // Check if user is logged in (e.g. check for profile avatar or logout button)
        // This depends on the UI implementation
        // await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    });
});
