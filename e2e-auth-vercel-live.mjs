import { chromium } from '@playwright/test';

const baseUrl = 'https://hachan.vercel.app';
const ts = Date.now();
const phone = `+23490${String(ts).slice(-8)}`;
const password = `Test!${String(ts).slice(-6)}Aa`;
const username = `user_${String(ts).slice(-6)}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

async function waitDashboard(label) {
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  if (!page.url().includes('/dashboard')) throw new Error(`${label}: redirect failed -> ${page.url()}`);
}

try {
  console.log('[LIVE-E2E] base:', baseUrl);
  console.log('[LIVE-E2E] creds:', { phone, username, password });

  await page.goto(`${baseUrl}/login?mode=register`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="displayName"]', 'Codex Test');
  await page.fill('input[name="phoneNumber"]', phone);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await waitDashboard('signup');
  console.log('[LIVE-E2E] signup OK');

  await context.clearCookies();

  await page.goto(`${baseUrl}/login?mode=login`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="phoneNumber"]', phone);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await waitDashboard('login');
  console.log('[LIVE-E2E] login OK');

  console.log(`[LIVE-E2E] PASS phone=${phone} password=${password}`);
} catch (err) {
  console.error('[LIVE-E2E] FAIL');
  console.error(err?.stack || err);
  await page.screenshot({ path: 'playwright-report/live-auth-fail.png', fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
