# Master Spec Backend — Otaku Insight

## 0. Mission de l’agent backend

Construire l’intégralité du backend de **Otaku Insight** en respectant strictement le produit déjà validé côté frontend.

Le backend doit être :
- production-ready
- modulaire
- testable
- observable
- sécurisé
- cohérent avec le user flow validé
- pensé pour une évolution vers mobile plus tard

Le backend ne doit pas être un simple CRUD. Il doit porter la logique métier centrale du produit :
- publication d’expertises
- drafts d’analyse
- calcul et agrégation des vibes
- ranking régional avec fallback intelligent
- système de validation sociale
- système de défi / duel
- réputation utilisateur et progression de rang
- analytics métier
- préférences utilisateur
- mode faible connexion compatible côté API

---

# 1. Stack technique imposée

## 1.1 Choix principaux

- **Langage** : TypeScript
- **Framework API** : NestJS
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Cache / queue / rate-limit technique** : Redis
- **Jobs asynchrones** : BullMQ
- **Stockage média** : S3-compatible ou Cloudinary
- **Auth** : JWT access + refresh token rotatif
- **Validation** : Zod ou class-validator côté boundary
- **Docs API** : OpenAPI / Swagger
- **Tests unitaires & intégration** : Jest
- **Observabilité** : Sentry + logs structurés + métriques HTTP/DB/Queue

## 1.2 Architecture recommandée

**Modular monolith**, pas microservices pour V1.

Raison :
- le domaine métier est déjà riche
- les flows sont fortement liés
- un monolithe modulaire bien structuré est plus rapide à produire et à maintenir
- les microservices créeraient une dette d’infra prématurée

---

# 2. Principes d’architecture

## 2.1 Règles absolues

- pas de logique métier critique dans les controllers
- controllers = transport only
- services métier = orchestration métier
- repositories / Prisma access = persistance
- DTOs/validators = validation d’entrée
- events métier = explicites
- transactions DB sur toutes les opérations multi-écritures critiques
- idempotence là où nécessaire
- jamais de hardcode métier côté frontend si la donnée doit devenir réelle

## 2.2 Structure logique des modules

Le backend doit être découpé au minimum en modules suivants :

- `auth`
- `users`
- `profiles`
- `anime`
- `catalog`
- `analysis-drafts`
- `analyses`
- `reputation`
- `community`
- `rankings`
- `challenges`
- `notifications`
- `analytics`
- `preferences`
- `storage`
- `health`
- `admin` (minimal interne)
- `common`

## 2.3 Convention de réponses API

Toutes les réponses doivent être cohérentes.

### Réponse succès standard
```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

### Réponse erreur standard
```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message lisible",
    "details": {}
  }
}
```

---

# 3. Domaine produit à respecter

## 3.1 Les 4 piliers d’analyse
Le backend doit utiliser strictement ces 4 critères :
- `VISUAL`
- `SCENARIO`
- `CHARACTERS`
- `SOUND`

Aucun critère `IMPACT`.

## 3.2 Valeurs internes des réponses du tunnel
Mapping obligatoire :
- `Bof...` → `1`
- `Pas mal` → `3`
- `Masterclass !` → `5`

## 3.3 Étapes du tunnel produit
Le backend doit être compatible avec le tunnel frontend suivant :
- Étape 1 : Visuel
- Étape 2 : Scénario
- Étape 3 : Personnages
- Étape 4 : Son
- Étape 5 : point fort unique
- Étape 6 : verdict en une phrase + tags
- Étape 7 : génération / publication du résultat

## 3.4 Récompense produit
Publication d’une expertise :
- **+10 Points d’Influence (PI)**

Validation crédible d’une analyse par un autre utilisateur :
- **+5 PI** pour l’auteur de l’analyse validée

## 3.5 Progression de rang
Rangs supportés :
- `APPRENTI`
- `EXPERT`
- `MAITRE`

Les seuils exacts peuvent être configurables, mais une proposition V1 est requise.

## 3.6 Défi / duel
- Le bouton “Défier l’Analyse” déclenche un nouveau tunnel
- Le résultat doit être marqué comme **contre-expertise** d’une analyse cible
- Limite : **1 défi par anime toutes les 24h pour un même utilisateur**

## 3.7 Ranking régional avec fallback
Règle métier :
- seuil minimum = **5 utilisateurs actifs**
- seuil minimum = **15 analyses publiées**
- fenêtre de temps = **30 derniers jours**

Ordre de fallback :
- Ville → Pays
- Pays → Afrique
- Afrique → Global

Le backend doit renvoyer un flag clair permettant au frontend d’afficher un message pédagogique sans recalcul client complexe.

---

# 4. Modèle de données global

## 4.1 Entités principales

Le système doit gérer au minimum :

- utilisateurs
- profils
- préférences
- anime
- genres
- studios
- watchlist
- drafts d’analyse
- expertises publiées
- réponses détaillées d’analyse
- validations
- défis
- réputation
- classements agrégés
- discussions communautaires
- notifications
- événements analytics
- sessions / refresh tokens
- devices utilisateur

---

# 5. Schéma de base de données détaillé

## 5.1 users

Champs recommandés :
- `id` UUID PK
- `email` unique nullable si auth sociale/phone plus tard
- `password_hash` nullable si provider externe possible plus tard
- `auth_provider` enum
- `status` enum (`ACTIVE`, `SUSPENDED`, `DELETED`)
- `email_verified_at` nullable
- `last_login_at` nullable
- `created_at`
- `updated_at`
- `deleted_at` nullable

Contraintes :
- email unique case-insensitive
- soft delete

## 5.2 user_profiles

- `user_id` UUID PK/FK
- `pseudo` unique
- `display_name` nullable
- `city_id` nullable
- `country_code` nullable
- `avatar_url` nullable
- `cover_image_url` nullable
- `bio` nullable
- `rank` enum (`APPRENTI`, `EXPERT`, `MAITRE`)
- `influence_points` int default 0
- `created_at`
- `updated_at`

## 5.3 user_preferences

- `user_id` UUID PK/FK
- `low_connection_mode` boolean default false
- `trending_alerts_enabled` boolean default true
- `peer_validation_alerts_enabled` boolean default true
- `preferred_region_scope` enum nullable (`CITY`, `COUNTRY`, `AFRICA`, `GLOBAL`)
- `language_code` varchar default `fr`
- `created_at`
- `updated_at`

## 5.4 geo_countries

- `id` UUID PK
- `name`
- `iso_code` unique
- `created_at`

## 5.5 geo_cities

- `id` UUID PK
- `country_id` FK
- `name`
- `normalized_name`
- `is_major_city` boolean
- `created_at`

Index sur `(country_id, normalized_name)`.

## 5.6 anime

- `id` UUID PK interne
- `external_provider` enum (`JIKAN`, `MANUAL`)
- `external_id` varchar nullable indexé
- `title`
- `title_normalized`
- `synopsis`
- `year` int nullable
- `season` enum nullable
- `episodes` int nullable
- `cover_image_url`
- `banner_image_url`
- `dominant_color_hex` nullable
- `studio_id` nullable FK
- `status` enum (`ACTIVE`, `ARCHIVED`)
- `created_at`
- `updated_at`

Contrainte recommandée :
- unique `(external_provider, external_id)` si external_id non null

## 5.7 studios

- `id` UUID PK
- `name` unique
- `created_at`

## 5.8 genres

- `id` UUID PK
- `name` unique
- `slug` unique

## 5.9 anime_genres

- `anime_id` FK
- `genre_id` FK
- PK composite `(anime_id, genre_id)`

## 5.10 watchlist_entries

- `id` UUID PK
- `user_id` FK
- `anime_id` FK
- `status` enum (`IN_PROGRESS`, `COMPLETED`, `PLANNED`, `DROPPED`)
- `episodes_seen` int default 0
- `updated_by_quick_track` boolean default false
- `created_at`
- `updated_at`

Unique `(user_id, anime_id)`.

## 5.11 analysis_drafts

Un vrai draft par anime et par utilisateur.

- `id` UUID PK
- `user_id` FK
- `anime_id` FK
- `version` int default 1
- `current_step_index` int
- `answers_json` jsonb
- `reason_criterion` enum nullable
- `verdict_text` text nullable
- `verdict_tags_json` jsonb nullable
- `last_client_saved_at` timestamptz nullable
- `created_at`
- `updated_at`

Unique `(user_id, anime_id)`.

## 5.12 analyses

Table principale des expertises publiées.

- `id` UUID PK
- `user_id` FK
- `anime_id` FK
- `source_draft_id` nullable FK
- `scope_city_id` nullable FK
- `scope_country_code` nullable
- `major_reason_criterion` enum
- `verdict_text` text
- `verdict_tags_json` jsonb
- `computed_score` int check 0..100
- `is_challenge` boolean default false
- `challenged_analysis_id` nullable FK self-reference
- `status` enum (`PUBLISHED`, `HIDDEN`, `DELETED`, `MODERATED`)
- `published_at`
- `created_at`
- `updated_at`

Indexes :
- `(anime_id, published_at desc)`
- `(user_id, published_at desc)`
- `(anime_id, status, published_at desc)`
- `(scope_country_code, published_at desc)`

## 5.13 analysis_answers

Normaliser les réponses plutôt que tout garder uniquement en JSON.

- `id` UUID PK
- `analysis_id` FK
- `criterion` enum
- `question_index` smallint
- `question_text_snapshot` text
- `answer_value` smallint check in (1,3,5)
- `created_at`

Unique `(analysis_id, criterion, question_index)`.

## 5.14 analysis_scores_by_criterion

- `analysis_id` FK
- `criterion` enum
- `computed_score` int check 0..100
- PK composite `(analysis_id, criterion)`

## 5.15 analysis_validations

- `id` UUID PK
- `analysis_id` FK
- `validator_user_id` FK
- `created_at`

Unique `(analysis_id, validator_user_id)`.

## 5.16 challenges

Cette table permet de suivre la logique duel de manière métier et anti-spam.

- `id` UUID PK
- `challenger_user_id` FK
- `anime_id` FK
- `target_analysis_id` FK
- `result_analysis_id` nullable FK
- `status` enum (`STARTED`, `COMPLETED`, `EXPIRED`, `CANCELLED`)
- `started_at`
- `completed_at` nullable
- `cooldown_until` timestamptz
- `created_at`

Indexes :
- `(challenger_user_id, anime_id, started_at desc)`

## 5.17 user_reputation_ledger

Ledger d’évolution des PI, indispensable pour audit et robustesse.

- `id` UUID PK
- `user_id` FK
- `source_type` enum (`ANALYSIS_PUBLISHED`, `ANALYSIS_VALIDATED`, `ADMIN_ADJUSTMENT`, `CHALLENGE_COMPLETED`)
- `source_id` UUID nullable
- `delta_points` int
- `balance_after` int
- `created_at`

## 5.18 user_reputation_snapshot

- `user_id` UUID PK
- `current_points` int
- `current_rank` enum
- `updated_at`

## 5.19 community_posts

Séparer discussion libre et expertise publiée.

- `id` UUID PK
- `anime_id` FK
- `author_user_id` FK
- `analysis_id` nullable FK
- `criterion` enum nullable
- `feed_scope` enum (`BENIN`, `GLOBAL`)
- `city_id` nullable FK
- `content` text
- `status` enum (`VISIBLE`, `HIDDEN`, `DELETED`, `MODERATED`)
- `created_at`
- `updated_at`

## 5.20 circle_rooms

- `id` UUID PK
- `type` enum (`CITY`, `RANK`, `CRITERION`)
- `title`
- `subtitle`
- `city_id` nullable FK
- `criterion` enum nullable
- `rank_required` enum nullable
- `is_active` boolean
- `created_at`

## 5.21 notifications

- `id` UUID PK
- `user_id` FK
- `type` enum (`VALIDATION_RECEIVED`, `TRENDING_ALERT`, `CHALLENGE_RESPONSE`, `RANK_UP`)
- `payload_json` jsonb
- `read_at` nullable
- `created_at`

## 5.22 analytics_events

Pas nécessairement exhaustif côté DB si provider externe, mais utile pour audit interne minimal.

- `id` UUID PK
- `user_id` nullable FK
- `device_id` nullable
- `session_id` nullable
- `event_name`
- `payload_json`
- `occurred_at`
- `received_at`

## 5.23 user_devices

- `id` UUID PK
- `user_id` FK
- `device_fingerprint` unique
- `platform` varchar
- `app_version` nullable
- `last_seen_at`
- `created_at`

## 5.24 refresh_tokens

- `id` UUID PK
- `user_id` FK
- `token_hash`
- `device_id` nullable FK user_devices
- `expires_at`
- `revoked_at` nullable
- `created_at`

## 5.25 regional_ranking_snapshots

Table d’agrégats calculés.

- `id` UUID PK
- `region_type` enum (`CITY`, `COUNTRY`, `AFRICA`, `GLOBAL`)
- `region_ref` varchar nullable
- `criterion` enum
- `anime_id` FK
- `score_value` numeric
- `active_user_count` int
- `published_analysis_count` int
- `window_days` int default 30
- `is_fallback` boolean
- `computed_at`

Unique logique sur `(region_type, region_ref, criterion, anime_id, window_days, computed_at bucket)` selon stratégie retenue.

---

# 6. Enums métier à définir

## 6.1 Criterion
- `VISUAL`
- `SCENARIO`
- `CHARACTERS`
- `SOUND`

## 6.2 Rank
- `APPRENTI`
- `EXPERT`
- `MAITRE`

## 6.3 FeedScope
- `BENIN`
- `GLOBAL`

## 6.4 RegionType
- `CITY`
- `COUNTRY`
- `AFRICA`
- `GLOBAL`

## 6.5 WatchlistStatus
- `IN_PROGRESS`
- `COMPLETED`
- `PLANNED`
- `DROPPED`

## 6.6 NotificationType
- `VALIDATION_RECEIVED`
- `TRENDING_ALERT`
- `CHALLENGE_RESPONSE`
- `RANK_UP`

---

# 7. Règles métier détaillées

## 7.1 Publication d’une expertise

### Entrée
Un utilisateur soumet :
- 12 réponses structurées (4 critères × 3 questions)
- un `reason_criterion`
- un `verdict_text`
- 0..n tags verdict
- éventuellement contexte défi

### Traitement obligatoire
1. vérifier que l’utilisateur existe et est actif
2. vérifier que l’anime existe
3. vérifier la cohérence des réponses
4. calculer les scores par critère
5. calculer le score final global
6. créer `analysis`
7. créer `analysis_answers`
8. créer `analysis_scores_by_criterion`
9. supprimer ou marquer obsolète le draft correspondant
10. incrémenter la réputation via ledger `+10`
11. recalculer snapshot réputation + rang
12. créer le community post associé si le produit l’exige automatiquement
13. publier event métier `analysis.published`
14. éventuellement déclencher recompute ranking asynchrone
15. retourner payload complet au frontend

### Transaction
La publication doit être transactionnelle.

## 7.2 Calcul du score final

Le frontend simule un calcul simple. Le backend doit devenir la source de vérité.

### Proposition V1 obligatoire
Pour chaque critère :
- moyenne des 3 réponses du critère
- normalisation sur 100

Exemple :
- moyenne 1 → 20
- moyenne 3 → 60
- moyenne 5 → 100

Ou formule équivalente, mais documentée et testée.

Puis score final :
- moyenne pondérée des 4 critères
- léger bonus de cohérence possible selon `reason_criterion`
- léger ajustement tags optionnel seulement si explicitement documenté

Important :
- toute formule doit être pure
- déterministe
- couverte par tests
- versionnée si elle évolue plus tard

### Recommandation
Créer un composant métier dédié :
- `InsightScoreEngine`

Avec :
- `computeCriterionScore()`
- `computeGlobalScore()`
- `explainScore()`

## 7.3 Draft d’analyse

### Règle produit
Un utilisateur peut avoir **un draft par anime**.

### Opérations nécessaires
- créer/upsert draft
- charger draft par `animeId`
- lister drafts utilisateur
- supprimer draft
- purger vieux drafts

### Important
Le frontend actuel a un draft global local. Le backend doit corriger cela en devenant plus propre : **draft scoped by user + anime**.

## 7.4 Validation d’une analyse

### Règles
- un utilisateur ne peut valider une analyse qu’une seule fois
- un utilisateur ne peut pas valider sa propre analyse
- si validation créée avec succès :
  - créer `analysis_validations`
  - créditer l’auteur de `+5 PI`
  - recalculer snapshot réputation
  - créer notification si activée

### Option avancée
Si une règle de validation par rang est introduite plus tard, l’architecture doit le permettre.

## 7.5 Défi / duel

### Démarrage d’un défi
Conditions :
- utilisateur authentifié
- cible existante
- anime existant
- pas de défi identique dans la fenêtre de 24h

### Effets
- créer `challenge`
- stocker `cooldown_until`
- autoriser tunnel lié à la cible

### Complétion
Quand la contre-expertise est publiée :
- lier `result_analysis_id`
- marquer `status=COMPLETED`
- analyse publiée avec `is_challenge=true`
- renseigner `challenged_analysis_id`

## 7.6 Réputation et rang

### Ledger obligatoire
Ne jamais modifier juste un compteur sans trace.

### Proposition de seuils V1
- `APPRENTI`: `0 – 99`
- `EXPERT`: `100 – 299`
- `MAITRE`: `300+`

Ces seuils doivent être configurables.

### Service métier dédié
Créer `ReputationService` avec :
- `applyDelta(userId, delta, sourceType, sourceId)`
- `recomputeRank(points)`
- `getLeaderboard(region)`

## 7.7 Ranking régional

### Source de vérité
Le backend décide du scope effectif.

Le frontend envoie une préférence :
- ville/pays/afrique/global

Le backend retourne :
- `requested_region`
- `effective_region`
- `is_fallback`
- `fallback_reason`
- `message_key`
- données ranking

### Algorithme V1
Pour une région donnée :
1. compter utilisateurs actifs sur 30 jours
2. compter analyses publiées sur 30 jours
3. si seuil atteint, garder scope
4. sinon fallback vers scope supérieur
5. recommencer jusqu’à trouver un scope valide
6. si rien n’est valide, finir en global

### Sortie attendue
Le backend doit pouvoir alimenter le message produit :
- “Cotonou a besoin de plus d'analystes ! En attendant, voici le Top Bénin.”

## 7.8 Low connection mode

Le backend ne gère pas le rendu, mais doit aider.

Il doit permettre :
- payloads compacts si demandé
- champs d’images optionnels
- mini-summary au lieu de blocs lourds
- URLs d’images adaptées au format léger si storage provider compatible

Support recommandé :
- query param `?lowConnection=true`
- ou header `x-low-connection: true`

---

# 8. Contrats API détaillés

## 8.1 Auth

### POST `/auth/register`
Créer un compte.

Input :
- email
- password
- pseudo
- countryCode optionnel
- cityId optionnel

Output :
- user profile minimal
- access token
- refresh token

### POST `/auth/login`
Input :
- email
- password
- device metadata

Output :
- access token
- refresh token
- user summary

### POST `/auth/refresh`
Input :
- refresh token

Output :
- new access token
- rotated refresh token

### POST `/auth/logout`
Révoque refresh token courant.

---

## 8.2 User / profile / preferences

### GET `/me`
Retourne le profil courant.

### PATCH `/me/profile`
Met à jour :
- pseudo
- cover image
- avatar
- bio
- city

### GET `/me/preferences`
### PATCH `/me/preferences`
Met à jour :
- lowConnectionMode
- trendingAlertsEnabled
- peerValidationAlertsEnabled
- preferredRegionScope

### GET `/me/reputation`
Retourne :
- current points
- current rank
- recent ledger entries

### GET `/me/history`
Retourne l’historique d’expertises publiées, filtrable par critère.

---

## 8.3 Catalog / anime

### GET `/anime`
Recherche et listing.

Filtres :
- `query`
- `season`
- `year`
- `genres[]`
- `studio`
- `page`
- `limit`
- `lowConnection`

### GET `/anime/:id`
Retourne détail complet de la fiche anime.

Payload attendu côté frontend :
- infos anime
- scores globaux
- scores locaux
- score utilisateur si existe
- commentaires communauté par critère
- top reviewer local
- local rank label éventuel

### GET `/anime/:id/radar`
Retourne données radar dédiées si séparation utile.

### GET `/anime/:id/community-comments?criterion=VISUAL`
Retourne les 3 derniers commentaires communauté pour un pilier.

---

## 8.4 Watchlist / quick track

### GET `/me/watchlist`
Liste watchlist utilisateur.

### PUT `/me/watchlist/:animeId`
Upsert statut + épisodes vus.

Input :
- status
- episodesSeen
- source: `QUICK_TRACK | DETAIL_PAGE`

---

## 8.5 Analysis drafts

### GET `/me/analysis-drafts`
Liste les drafts utilisateur.

### GET `/me/analysis-drafts/:animeId`
Retourne le draft pour un anime donné.

### PUT `/me/analysis-drafts/:animeId`
Upsert draft.

Input :
- version
- currentStepIndex
- answers
- reasonCriterion nullable
- verdictText nullable
- verdictTags
- lastClientSavedAt nullable

### DELETE `/me/analysis-drafts/:animeId`
Supprime le draft.

---

## 8.6 Analyses

### POST `/analyses`
Publie une expertise.

Input :
- `animeId`
- `answers` structurées
- `reasonCriterion`
- `verdictText`
- `verdictTags`
- `challengeId` nullable
- `deviceContext` optionnel

Output :
- analyse créée
- score final
- scores par critère
- newInfluencePoints
- newRank
- scrollAnchorId ou analysisId
- success message key

### GET `/analyses/:id`
Détail d’une expertise.

### GET `/anime/:id/analyses`
Liste expertises publiées pour un anime.

Filtres :
- `scope=BENIN|GLOBAL`
- `criterion`
- `sort=TOP|RECENT`
- `page`
- `limit`

---

## 8.7 Validation sociale

### POST `/analyses/:id/validate`
Crée une validation.

Output :
- new validation count
- new author PI if exposed
- notification triggered flag

### DELETE `/analyses/:id/validate`
Optionnel selon UX. Pour V1, mieux vaut décider explicitement. Si non supporté, ne pas exposer.

---

## 8.8 Challenges

### POST `/analyses/:id/challenge`
Démarre un défi.

Input :
- optional note

Output :
- `challengeId`
- `cooldownUntil`
- `animeId`
- target analysis summary

### GET `/me/challenges`
Retourne défis lancés / reçus.

### GET `/anime/:id/challenges`
Optionnel pour vue communautaire avancée.

---

## 8.9 Rankings

### GET `/rankings`
Input :
- `requestedRegionType`
- `requestedRegionRef`
- `criterion`
- `windowDays`

Output :
- requested region
- effective region
- isFallback
- fallbackReason
- messageKey
- ranking list
- activeUserCount
- publishedAnalysisCount

### GET `/rankings/masters`
Retourne les “Maîtres Otaku” pour la région effective.

---

## 8.10 Community / circles

### GET `/community/feed`
Input :
- `animeId`
- `scope`
- `criterion`
- `prioritizeWatchlist=true|false`

Output :
- messages
- metadata tri

### GET `/community/circles`
Retourne les rooms/circles.

### POST `/community/posts`
Créer un post communautaire libre si la V1 le permet.

---

## 8.11 Notifications

### GET `/me/notifications`
### POST `/me/notifications/:id/read`
### POST `/me/notifications/read-all`

---

## 8.12 Analytics

### POST `/analytics/events/batch`
Le frontend peut pousser des events en batch.

Input :
- array d’événements

Chaque event doit pouvoir embarquer :
- `eventName`
- `sessionId`
- `deviceId`
- `occurredAt`
- `payload`

Important :
les événements de publication ne doivent pas être considérés comme source de vérité métier.

---

# 9. Contrats de payload attendus par le frontend

## 9.1 Anime detail payload
Doit inclure :
- `id`
- `title`
- `studio`
- `genres`
- `synopsis`
- `cover`
- `banner`
- `dominantColor`
- `year`
- `season`
- `episodes`
- `vibeScore`
- `globalScore`
- `criteria`
- `community`
- `communityComments`

## 9.2 Ranking payload
Doit inclure :
- `requestedRegion`
- `effectiveRegion`
- `isFallback`
- `messageKey`
- `list`
- `leaders`
- `activeUserCount`
- `analysisCount`

## 9.3 Analysis publish response
Doit inclure :
- `analysisId`
- `score`
- `reason`
- `verdict`
- `newInfluencePoints`
- `newRank`
- `successMessage`
- `scrollAnchorId`

---

# 10. Sécurité

## 10.1 Auth
- hash passwords avec Argon2 ou bcrypt cost élevé
- refresh tokens hashés en DB
- rotation refresh obligatoire
- révocation supportée
- JWT courts côté access token

## 10.2 Validation entrées
Tout input doit être validé strictement :
- types
- enums
- limites de longueur
- sanitation texte si nécessaire

## 10.3 Permissions
- impossible de modifier le profil d’un autre utilisateur
- impossible de publier une validation sur sa propre analyse
- impossible de contourner le cooldown défi
- impossible de falsifier les PI côté client

## 10.4 Rate limiting
Mettre du rate limiting sur :
- auth
- validation sociale
- challenge creation
- analytics ingest
- commentaire / post communautaire

## 10.5 Audit minimal
Tracer :
- login
- refresh
- publish analysis
- validate analysis
- challenge create
- admin actions

---

# 11. Cache, jobs et asynchronisme

## 11.1 Redis — usages autorisés
- cache read-heavy sur anime detail
- cache ranking
- rate limiting
- queue BullMQ
- session technique éventuelle

## 11.2 Jobs BullMQ recommandés
Créer au minimum ces jobs :

- `recompute-regional-rankings`
- `dispatch-notification`
- `rebuild-anime-aggregates`
- `purge-stale-drafts`
- `ingest-external-anime-data`
- `recompute-user-rank`

## 11.3 Événements métier à publier
Créer un bus d’événements applicatifs internes au moins logique :
- `analysis.published`
- `analysis.validated`
- `challenge.started`
- `challenge.completed`
- `ranking.recompute.requested`
- `user.rank.changed`

---

# 12. Agrégations et calculs

## 12.1 Agrégats anime
Maintenir des agrégats pour chaque anime :
- moyenne globale score
- moyenne locale pays
- moyenne par critère
- total analyses publiées
- total validations reçues

## 12.2 Agrégats utilisateur
Maintenir :
- total analyses publiées
- total validations reçues
- score moyen par critère
- style d’analyse moyen

## 12.3 Agrégats régionaux
Maintenir :
- nb utilisateurs actifs
- nb analyses publiées 30 jours
- top anime par critère
- leaders réputation

---

# 13. Stratégie d’analytics métier

Le frontend a déjà des events nommés.
Le backend doit accepter et normaliser au minimum :
- `tunnel_start`
- `step_view`
- `step_complete`
- `insight_published`
- `analysis_validated`
- `analysis_challenge_started`
- `home_time_to_action`
- `analysis_draft_restored`
- `analysis_draft_dismissed`
- `analysis_scroll_to_fresh_entry`

Chaque event backend ingéré devrait idéalement être enrichi avec :
- `userId` si auth
- `deviceId`
- `sessionId`
- `receivedAt`

---

# 14. Compatibilité avec le frontend existant

Le backend doit explicitement corriger / reprendre ces points du frontend actuel :

## 14.1 Ce qui est mock côté frontend aujourd’hui
- géolocalisation utilisateur
- densité régionale
- publication d’analyse
- PI persistés
- validations persistées
- défi persisté
- ranking réel
- commentaires communauté réels

## 14.2 Ce que le backend doit rendre réel
- drafts par anime
- score calculé côté serveur
- fallback régional serveur
- réputation serveur
- validations uniques et persistées
- cooldown défi serveur
- watchlist persistée
- notifications persistées

---

# 15. Ordre d’implémentation exigé

## Phase 1 — Fondation
1. bootstrap NestJS
2. config env
3. Prisma schema
4. migrations initiales
5. auth module
6. users/profiles/preferences
7. healthcheck
8. logging + error filter + swagger

## Phase 2 — Catalogue
9. anime module
10. studios + genres
11. anime detail response
12. search + filters

## Phase 3 — Watchlist & drafts
13. watchlist module
14. analysis-drafts module
15. tests sur upsert/load/delete draft

## Phase 4 — Analyses
16. score engine
17. analyses publish endpoint
18. analysis answers storage
19. reputation ledger
20. rank recompute
21. tests transactionnels publication

## Phase 5 — Community
22. community feed
23. validations
24. challenges + cooldown 24h
25. notifications validation/challenge

## Phase 6 — Rankings
26. ranking computation service
27. fallback logic serveur
28. ranking endpoints
29. masters endpoints
30. scheduled recompute jobs

## Phase 7 — Analytics / observabilité / hardening
31. analytics ingest
32. Sentry
33. metrics
34. rate limiting
35. seed + fixtures
36. e2e critical path tests

---

# 16. Seed data requis

Prévoir un seed de développement incluant :
- 10 utilisateurs
- 4 rangs répartis logiquement
- 4 anime minimum cohérents avec le frontend actuel
- studios
- genres
- 20 analyses publiées
- 15 validations
- 5 défis
- ranking data minimum
- notifications exemples

Important :
les identifiants n’ont pas besoin de matcher exactement le mock frontend, mais les données conceptuelles doivent être compatibles.

---

# 17. Tests obligatoires

## 17.1 Unit tests minimum
- score engine
- fallback algorithm
- reputation computation
- challenge cooldown checker
- draft upsert logic

## 17.2 Integration tests minimum
- register/login/refresh/logout
- publish analysis transaction complète
- validate analysis une seule fois
- cannot validate own analysis
- challenge blocked during cooldown
- ranking fallback country → africa → global
- draft load/save/delete by anime

## 17.3 E2E critical flows
- utilisateur publie une expertise → +10 PI
- utilisateur valide une analyse → +5 PI auteur
- utilisateur lance un défi → publication contre-expertise
- utilisateur récupère un draft en cours
- frontend ranking request reçoit `isFallback=true`

---

# 18. Contraintes de qualité de code pour l’agent IA backend

L’agent backend doit :
- écrire du code production-ready
- utiliser des transactions Prisma quand nécessaire
- éviter les services god-object
- séparer clairement DTO / service / repository
- documenter le code non trivial
- fournir tests et seed
- fournir `.env.example`
- fournir instructions de lancement
- fournir migration initiale
- fournir OpenAPI

L’agent ne doit pas :
- hardcoder les PI directement dans les controllers
- calculer les scores dans les DTOs
- disperser la logique de fallback dans 5 fichiers
- dépendre du frontend pour des règles de sécurité

---

# 19. Variables d’environnement à prévoir

Exemple :
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TTL`
- `JWT_REFRESH_TTL`
- `SENTRY_DSN`
- `S3_ENDPOINT`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `APP_BASE_URL`
- `CORS_ORIGIN`

---

# 20. Livrables attendus de l’agent backend

L’agent doit livrer :
1. le code NestJS complet
2. le schéma Prisma complet
3. les migrations
4. les seeds
5. la doc API Swagger
6. les tests unitaires
7. les tests d’intégration
8. un README de setup
9. un README d’architecture
10. un mapping explicite frontend ↔ backend pour les endpoints critiques

---

# 21. Résumé exécutif à ne jamais oublier

Le backend Otaku Insight doit être la source de vérité sur :
- la publication des expertises
- les Points d’Influence
- les validations
- les défis
- le fallback régional
- les classements
- les drafts par anime
- les préférences utilisateur

Le frontend ne doit jamais être la source finale de vérité sur ces sujets.

---

# 22. Première tâche à exécuter par l’agent backend

Ordre strict recommandé :
1. initialiser NestJS
2. définir les enums et le schéma Prisma
3. générer la DB et les migrations
4. implémenter auth + users + profiles + preferences
5. implémenter anime + search + detail
6. implémenter drafts
7. implémenter score engine
8. implémenter publication d’analyse transactionnelle
9. implémenter réputation
10. implémenter validations et défis
11. implémenter rankings + fallback
12. implémenter analytics + notifications + jobs

---

# 23. Directive finale pour l’agent

Tu ne construis pas une simple API CRUD.
Tu construis le moteur métier central d’un produit communautaire d’analyse d’anime, avec une forte contrainte de cohérence UX, de fiabilité des données, et de scalabilité raisonnable.

Toute décision technique doit favoriser :
- cohérence métier
- vérité serveur
- simplicité d’exploitation
- testabilité
- évolutivité vers mobile et temps réel plus tard
