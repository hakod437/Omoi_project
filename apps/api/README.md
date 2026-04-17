# API Backend - Otaku Insight

Ce package contient le backend NestJS de Otaku Insight.

## Prerequis

- Node.js >= 20
- PostgreSQL >= 14
- Redis >= 6

## Installation

```bash
npm install
```

## Configuration

1. Copier `.env.example` vers `.env`.
2. Completer au minimum:
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`

## Base de donnees

```bash
# Generer le client Prisma
npm run db:generate

# Creer/appliquer les migrations
npm run db:migrate
```

## Lancement

```bash
# Mode developpement
npm run start:dev

# Build production
npm run build
npm run start:prod
```

## Tests

```bash
npm run test
npm run test:e2e
```

## Documentation API

- Swagger: `/api/docs`
- Healthcheck: `/api/health`

## Etat actuel

Fondation phase 1 implementee:
- config/env validation stricte
- format de reponse API unifie
- filtre d'erreur global sans stack trace exposee
- auth JWT access+refresh rotatif
- endpoint `/me` profile/preferences/reputation
- Prisma modele phase 1 utilisateurs/profils/preferences/reputation/devices/tokens

Voir l'architecture detaillee dans `README.architecture.md`.
