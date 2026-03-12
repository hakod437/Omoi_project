# Omoi

Application Next.js 15 + Prisma + NextAuth.

## Demo

- Production: https://hachan.vercel.app

## Prérequis

- Node.js 20+
- npm 10+
- Une base PostgreSQL (Supabase recommandé)

## Installation rapide

1. Installer les dépendances

```bash
npm install
```

2. Configurer les variables d'environnement dans `.env`

```env
# App
AUTH_SECRET=your_random_secret
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# Optional transition fallback for admin protection
ADMIN_USER_IDS="cuid_1,cuid_2"
# or
ADMIN_USER_EMAILS="admin@example.com,owner@example.com"

# Supabase / Postgres
# Runtime app (pooler)
DATABASE_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?uselibpqcompat=true&sslmode=require&pgbouncer=true"

# Prisma schema ops (db push / migrate)
DIRECT_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?uselibpqcompat=true&sslmode=require&connect_timeout=15"

# (si utilisés dans l'app)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. Synchroniser le schéma Prisma

```bash
npx prisma db push --accept-data-loss
npx prisma generate
```

4. Promouvoir un compte administrateur

```bash
node scripts/promote-user-admin.mjs admin@example.com
```

5. Lancer le projet

```bash
npm run dev
```

6. Ouvrir l'application

```text
http://localhost:3000
```

## Scripts utiles

```bash
npm run dev          # développement
npm run build        # build production
npm run start        # lancer la build
npm run lint         # lint
npm run test         # tests Playwright
```

## Déploiement Vercel

Le projet utilise `vercel.json` avec:

```json
{
  "framework": "nextjs"
}
```

Variables à définir dans Vercel (`Production`, `Preview`, `Development`):

- `AUTH_SECRET`
- `AUTH_URL` (ex: `https://hachan.vercel.app`)
- `AUTH_TRUST_HOST=true`
- optionnel en transition: `ADMIN_USER_IDS` ou `ADMIN_USER_EMAILS`
- `DATABASE_URL` (pooler `:6543`, voir format ci-dessus)
- `DIRECT_URL` (pooler session `:5432`, voir format ci-dessus)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Déployer:

```bash
npx vercel --prod --yes
```

## Dépannage

- Erreur Prisma `P1011` / `self-signed certificate in certificate chain`:
  - Vérifier `DATABASE_URL`/`DIRECT_URL` et garder `uselibpqcompat=true&sslmode=require`.
  - Vérifier qu'il n'y a pas de retour ligne caché dans les variables Vercel.
- Erreur Prisma `P1001`:
  - Vérifier host/port/credentials.
  - En WSL, préférer les URLs pooler Supabase (`aws-...pooler...`) si l'IPv6 direct pose problème.

## Sécurité

- Ne jamais commit `.env`.
- Si un secret a été exposé, faire une rotation immédiate (DB password, clés Supabase, etc.).
- Les actions admin utilisent désormais `User.role` en base et propagent ce rôle dans la session NextAuth.
