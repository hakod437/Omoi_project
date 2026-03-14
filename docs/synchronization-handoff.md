# Synchronization Handoff - AniList Backend Adaptation

Date: 2026-03-14 (updated)
Project: `animevault`
Scope: Align backend and core flows with `docs/anilist-backend-logic.md` and `docs/anilist-user-flow.md`.

## 1) What was implemented

### Backend core

- Added AniList backend client and error model:
  - `lib/anilist.ts`
- Added new API routes aligned with user-flow docs:
  - `app/api/anime/search/route.ts`
  - `app/api/me/route.ts`
  - `app/api/me/list/route.ts`

### Frontend/backend wiring

- Search now calls backend AniList API (not direct Jikan call):
  - `components/organisms/SearchBar.tsx`
- Login page now exposes AniList OAuth entry point:
  - `app/(public)/login/page.tsx`

### Infra compatibility

- Added AniList image domains for Next Image:
  - `next.config.ts`
  - domains: `s4.anilist.co`, `img.anili.st`

### User-flow pages previously added in this session

- `app/(protected)/me/page.tsx`
- `app/(protected)/me/list/page.tsx`
- `components/organisms/MyListManager.tsx`
- Updated:
  - `app/(protected)/sync/page.tsx`
  - `app/(protected)/dashboard/page.tsx`
  - `app/(protected)/explorer/page.tsx`
  - `app/(public)/login/page.tsx`
  - `components/organisms/Navbar.tsx`

## 2) Backend behavior now

### `GET /api/anime/search`

- Query params: `q`, `page`, `perPage`
- Uses AniList GraphQL `Page.media` search
- Response states:
  - `success`
  - `rate_limited` (429 with retry metadata)
  - `error`

### `GET /api/me`

- Requires session via `auth()`
- Uses local DB user as baseline payload
- If AniList token missing/expired: `auth_required` with local fallback payload
- If AniList available: fetches `Viewer`
- Response states:
  - `success`
  - `auth_required`
  - `rate_limited`
  - `partial`

### `GET /api/me/list`

- Requires session via `auth()`
- Returns local list fallback from Prisma
- If AniList token ready: fetches AniList `mediaList` (paginated)
- Response states:
  - `success`
  - `auth_required`
  - `rate_limited`
  - `partial`

## 3) Important architecture decisions

- Keep user-scoped server data paths derived from authenticated user session (`auth()/requireUserId()`), no client userId trust.
- Preserve local DB as resilience fallback when AniList is unavailable or token is invalid.
- Normalize AniList failures with explicit state enums for UX (`auth_required`, `partial`, `rate_limited`, `error`).

## 4) Known gaps / next steps for next IA

1. ~~AniList OAuth provider is not yet wired in `lib/auth.ts`.~~ **DONE (2026-03-14)** — OAuth fully wired, see section 8.
2. `SearchBar` maps AniList `id` into existing `mal_id` field contract for compatibility.
   - Consider introducing a provider-agnostic `externalId` model and stop overloading MAL semantics.
3. `anime/[id]` page still fetches from Jikan and persists via `malId`.
   - Needs full migration strategy to AniList IDs or dual-provider abstraction.
4. Optional: add contract tests for API state envelopes and rate-limit behavior.
5. Add OAuth regression tests (provider callback + account/token persistence) once env-backed test setup is available.

## 5) Validation checklist for next IA

- Run:
  - `npm run lint`
  - `npm run build`
  - `npm run test`
- If Playwright environment missing vars/services, run targeted API verification with authenticated session mocks.
- Verify manual smoke:
  - `/explorer` search dropdown returns AniList results via `/api/anime/search`
  - `/api/me` and `/api/me/list` return expected state envelopes for:
    - no session
    - session without AniList account
    - session with expired AniList token

## 5.1) Test suite audit (review completed)

Status summary:

- Existing tests are useful but not complete for AniList migration.
- Current suite is heavily auth/UI oriented and DB-coupled.
- AniList API routes now have baseline automated coverage.

Files reviewed:

- `tests/auth.spec.ts`
- `tests/admin-role.spec.ts`
- `playwright.config.ts`
- `scripts/exhaustive-auth-test.ts`
- `scripts/verify-features.ts`
- `scripts/exhaustive-simulation.ts`
- `scripts/test-recalculation.ts`
- `scripts/test-scoring.ts`

Coverage currently present:

- Landing/login navigation checks.
- Credential register/login flow.
- Session role exposure (`/api/auth/session`) for admin user.
- Scoring and recalculation utility scripts.

Critical coverage still missing for AniList backend:

- No OAuth AniList flow tests (provider callback + token persistence).
- No dedicated mock/unit tests for `lib/anilist.ts` error translation paths.
- No regression tests for SearchBar ID mapping (`AniList id` currently mapped into `mal_id` compatibility field).
- No deterministic tests for `rate_limited`/`partial` envelopes (hard to force without mocks).

Update after this audit pass:

- Added contract tests for AniList-backed API routes:
  - `tests/anilist-api.spec.ts`
- Hardened admin-role test cleanup:
  - `tests/admin-role.spec.ts` now preserves and restores original role.

Quality risks found:

1. Playwright E2E depends on real DB state and hardcoded credentials (`0123456789`), increasing flakiness and environment coupling.
2. `playwright.config.ts` runs Chromium/Firefox/WebKit by default, which is expensive for CI smoke checks.
3. Script-based tests in `scripts/*.ts` are not integrated into `npm` scripts or CI pass/fail gates.
4. Some script checks are mostly console-output assertions (not formal test runner assertions).
5. Default Playwright config can fail if port 3000 is occupied by a stale listener.

Recommended immediate test priorities:

1. Add mock-based tests for `lib/anilist.ts` error translation (429, timeout, GraphQL 200+errors).
2. Add a dedicated fast smoke profile (`chromium` only) for CI; keep multi-browser as nightly.
3. Introduce seeded test fixtures isolated by namespace to avoid mutating shared users.
4. Add real OAuth provider flow tests once AniList OAuth is wired in NextAuth.

## 6) Files touched for AniList backend adaptation

- `lib/anilist.ts`
- `app/api/anime/search/route.ts`
- `app/api/me/route.ts`
- `app/api/me/list/route.ts`
- `components/organisms/SearchBar.tsx`
- `next.config.ts`

Test and quality files inspected during this audit:

- `tests/auth.spec.ts`
- `tests/admin-role.spec.ts`
- `playwright.config.ts`
- `scripts/exhaustive-auth-test.ts`
- `scripts/verify-features.ts`
- `scripts/exhaustive-simulation.ts`
- `scripts/test-recalculation.ts`
- `scripts/test-scoring.ts`

Files added/updated by this test hardening pass:

- `tests/anilist-api.spec.ts` (new)
- `tests/admin-role.spec.ts` (restores original user role)
- `playwright.api.config.ts` (new, API tests without webServer)
- `playwright.local.config.ts` (new, local stable chromium runs)

Files added/updated by OAuth wiring pass (2026-03-14):

- `lib/auth.ts` (full rewrite — OAuth + DB sync, ~360 lines)
- `app/(public)/login/page.tsx` (added AniList button + handler)
- `.env` (added ANILIST_CLIENT_ID + ANILIST_CLIENT_SECRET)
- `README.md` (added AniList env vars documentation)

## 5.2) Validation execution results (latest run)

- `npm run lint`: PASS
- `npm run build`: PASS
- `npx playwright test -c playwright.api.config.ts` with `PLAYWRIGHT_BASE_URL=http://localhost:3001`: PASS (4/4)
- `npx playwright test tests/admin-role.spec.ts -c playwright.local.config.ts` with `PLAYWRIGHT_BASE_URL=http://localhost:3001`: PASS (1/1)
- `npx playwright test tests/auth.spec.ts -c playwright.local.config.ts` with `PLAYWRIGHT_BASE_URL=http://localhost:3001`: FAIL (1 test)
  - failing case: `should switch between Login and Join modes in Navbar`
  - observed error: `locator('h1')` not found after `/login?mode=login`
- `npx -y tsx scripts/test-scoring.ts`: PASS (3/3)
- `npx -y tsx scripts/test-recalculation.ts`: PASS

Root-cause note for instability:

- `playwright.config.ts` expects `webServer.url = http://localhost:3000`.
- In this environment, port `3000` can be occupied by an unresponsive process, causing false negatives/timeouts.
- Workaround used: run tests against `http://localhost:3001` with custom Playwright configs.

## 8) AniList OAuth wiring — session 2026-03-14

### What was implemented

- `lib/auth.ts` fully rewritten to add AniList OAuth provider alongside credentials:
  - `fetchAniListViewerProfile(accessToken)` — GraphQL `Viewer` query
  - `syncAniListAccount(params)` — upserts `User` + `Account` in DB with token + avatar
  - `normalizeUsername()` / `getUniqueUsername()` — unique username generation
  - Provider pushed conditionally only if `ANILIST_CLIENT_ID` + `ANILIST_CLIENT_SECRET` set
  - **Critical fix**: `userinfo.url: ANILIST_GRAPHQL_URL` required by Auth.js v5 `InvalidEndpoints` validation
  - `signIn` callback: DB sync for `anilist` provider
  - `jwt` callback: reads `userId` + `role` from DB Account
- `app/(public)/login/page.tsx`: added `Continuer avec AniList` button + `handleAniListLogin()` handler
- `.env`: added `ANILIST_CLIENT_ID=37165` and `ANILIST_CLIENT_SECRET`

### Validation results

- `npm run lint`: PASS
- `npm run build`: PASS
- `npx playwright test tests/anilist-api.spec.ts`: 4/4 PASS
- `/api/auth/providers`: returns both `credentials` and `anilist`
- Browser headless: `/login` → `Continuer avec AniList` → redirects to `https://anilist.co/login?...&client_id=37165&redirect_uri=http://localhost:3000/api/auth/callback/anilist` ✓
- Userflow smoke test: 11/11 checkpoints PASS (login→dashboard, shortcuts, navbar, sync actions, mode toggle)

### Bug fixed during this session

- `InvalidEndpoints`: Auth.js v5 requires explicit `userinfo.url` on custom OAuth providers — added `url: ANILIST_GRAPHQL_URL`

### Remaining gaps

1. `SearchBar` maps AniList `id` → `mal_id` (semantic debt — needs `externalId` migration)
2. `anime/[id]` page still Jikan-based with `malId` — needs migration to AniList IDs
3. OAuth regression Playwright tests not yet created
4. `tests/userflow-navigation.spec.ts` not yet created
5. AniList client secret was shared in chat session — **rotate it** in AniList Developer Settings

## 7) Rollback hints

- To temporarily revert to previous provider behavior for search only:
  - restore `components/organisms/SearchBar.tsx` to `lib/jikan.ts` usage.
- To disable AniList API integration while keeping routes:
  - gate route handlers behind env flag and return `partial/local` payload.

## 9) Deployment update checklist (Vercel)

Apply this checklist after sync changes related to AniList:

1. Vercel env vars must be set in `Production`, `Preview`, `Development`:
  - `AUTH_SECRET`
  - `AUTH_URL`
  - `AUTH_TRUST_HOST=true`
  - `ANILIST_CLIENT_ID`
  - `ANILIST_CLIENT_SECRET`
  - `DATABASE_URL`
  - `DIRECT_URL`
2. AniList OAuth callback in AniList Developer Settings:
  - `https://hachan.vercel.app/api/auth/callback/anilist`
3. If any credential was exposed during dev/chat, rotate before release:
  - `ANILIST_CLIENT_SECRET`
  - DB credentials / URLs
4. Redeploy:
  - `npx vercel --prod --yes`
5. Post-deploy checks:
  - `/api/auth/providers` contains both `credentials` and `anilist`
  - AniList login redirect works from `/login`
  - `/api/me` and `/api/me/list` return expected state envelopes
