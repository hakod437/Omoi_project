import { chromium } from '@playwright/test';

const baseUrl = 'https://hachan.vercel.app';
const ts = Date.now();
const phone = `+23490${String(ts).slice(-8)}`;
const password = `Test!${String(ts).slice(-6)}Aa`;
const username = `user_${String(ts).slice(-6)}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

page.on('console', msg => console.log('[browser]', msg.type(), msg.text()));

try {
  console.log('[E2E-DEBUG] Base URL:', baseUrl);
  console.log('[E2E-DEBUG] Test user:', { phone, username });

  await page.goto(`${baseUrl}/login?mode=register`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="displayName"]', 'Codex Test');
  await page.fill('input[name="phoneNumber"]', phone);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForTimeout(5000);
  console.log('[E2E-DEBUG] URL after signup submit:', page.url());

  const msgText = await page.locator('p.text-red-400, p.text-emerald-400').first().textContent().catch(() => null);
  console.log('[E2E-DEBUG] Form message:', msgText || '(none)');

  const sessionRes = await page.request.get(`${baseUrl}/api/auth/session`);
  const sessionBody = await sessionRes.text();
  console.log('[E2E-DEBUG] /api/auth/session status:', sessionRes.status());
  console.log('[E2E-DEBUG] /api/auth/session body:', sessionBody);

  await page.screenshot({ path: 'playwright-report/signup-debug.png', fullPage: true });
  console.log('[E2E-DEBUG] Screenshot saved: playwright-report/signup-debug.png');

  console.log(`[E2E-DEBUG] creds phone=${phone} password=${password}`);
} catch (err) {
  console.error('[E2E-DEBUG] FAIL');
  console.error(err?.stack || err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
