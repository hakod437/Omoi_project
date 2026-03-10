import { chromium } from '@playwright/test';

const baseUrl = 'https://omoi-h26ljlk67-halimpro318-5265s-projects.vercel.app';
const ts = Date.now();
const phone = `+23490${String(ts).slice(-8)}`;
const password = `Test!${String(ts).slice(-6)}Aa`;
const username = `user_${String(ts).slice(-6)}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

async function ensureDashboard(step) {
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  const url = page.url();
  if (!url.includes('/dashboard')) throw new Error(`${step}: expected dashboard redirect, got ${url}`);
}

try {
  console.log('[E2E] Base URL:', baseUrl);
  console.log('[E2E] Test user:', { phone, username });

  await page.goto(`${baseUrl}/login?mode=register`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="displayName"]', 'Codex Test');
  await page.fill('input[name="phoneNumber"]', phone);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await ensureDashboard('signup');
  console.log('[E2E] Signup OK');

  await context.clearCookies();

  await page.goto(`${baseUrl}/login?mode=login`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="phoneNumber"]', phone);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await ensureDashboard('login');
  console.log('[E2E] Login OK');

  console.log(`[E2E] RESULT: PASS | phone=${phone} | password=${password}`);
} catch (err) {
  console.error('[E2E] RESULT: FAIL');
  console.error(err?.stack || err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
