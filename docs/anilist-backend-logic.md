# Logique Backend AniList (Vue Complete, Cote Integrateur)

Ce document decrit la logique backend a implementer pour integrer proprement AniList dans une application serveur (Node.js/Next.js, FastAPI, Go, etc.).

Important: le backend interne exact d'AniList (infrastructure privee, architecture interne, implementation metier) n'est pas public. Ce document couvre la logique observable et verifiable via la documentation officielle et le comportement de l'API publique.

## 1) Vue d'ensemble du backend AniList (API publique)

- Protocole principal: `GraphQL` via HTTP.
- Endpoint unique API: `https://graphql.anilist.co`.
- Methode HTTP: `POST`.
- Authentification: `OAuth2` (Authorization Code Grant et Implicit Grant), tokens `Bearer`.
- Donnees: anime, manga, personnages, staff, listes utilisateur, etc.

En pratique, ton backend agit comme une couche d'orchestration:

- Gere les sessions utilisateur et les tokens AniList.
- Construit des requetes GraphQL type-safe.
- Applique cache, retry, backoff, rate limiting, observabilite.
- Normalise les erreurs AniList pour ton front.

## 2) Modules backend recommandes

## 2.1 `auth-service`

Responsabilites:

- Rediriger l'utilisateur vers l'URL d'autorisation AniList.
- Echanger `code` -> `access_token` (Authorization Code flow).
- Stocker les tokens de maniere securisee.
- Gerer expiration (tokens valides 1 an) et re-auth quand expire.

Points cles AniList:

- Pas de scopes OAuth.
- Pas de refresh token.
- Token longue duree (~1 an).

## 2.2 `anilist-client`

Responsabilites:

- Envoyer toutes les requetes GraphQL vers `https://graphql.anilist.co`.
- Injecter les headers (`Content-Type`, `Accept`, `Authorization` si besoin).
- Ajouter correlation-id / request-id interne.
- Parser `data` + `errors` (GraphQL peut renvoyer des erreurs avec HTTP 200).

## 2.3 `rate-limit-guard`

Responsabilites:

- Lire les headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `Retry-After`
  - `X-RateLimit-Reset`
- Appliquer backoff et circuit-breaker leger.
- Prioriser les requetes critiques en cas de saturation.

Notes:

- Limite normale annoncee: 90 req/min.
- La doc mentionne aussi une phase degradee temporaire a 30 req/min (a surveiller dynamiquement).

## 2.4 `query-layer` (services metier)

Responsabilites:

- Exposer des use-cases metier: `searchAnime`, `getUserList`, `updateListEntry`, etc.
- Eviter le sur-fetching via selection fine des champs GraphQL.
- Centraliser pagination `Page` + `pageInfo.hasNextPage`.

## 2.5 `cache-layer`

Responsabilites:

- Cache court TTL pour donnees publiques (recherche, fiches media).
- Cache utilisateur prudent pour donnees privees (cle par userId AniList).
- Invalidation apres mutation (write-through ou delete-on-write).

## 2.6 `observability`

Responsabilites:

- Logs structures (latence, operationName, statut HTTP, erreurs GraphQL).
- Metriques (taux d'erreur, 429/min, p95 latence).
- Alertes sur hausse 429 et erreurs de validation.

## 3) Flux backend principal

## 3.1 Donnees publiques (sans auth)

1. Client appelle ton endpoint backend (`/api/anime/search?q=...`).
2. Ton backend construit une requete GraphQL AniList.
3. `anilist-client` execute le `POST`.
4. Backend retourne un DTO stable au front (pas brut AniList si possible).

Avantage: tu gardes le controle sur schema, cache, et evolution API.

## 3.2 Donnees privees / mutations (avec auth)

1. Utilisateur clique "Login with AniList".
2. Redirection vers `https://anilist.co/api/v2/oauth/authorize?...`.
3. Callback backend recoit `code`.
4. Backend echange `code` contre `access_token` via `https://anilist.co/api/v2/oauth/token`.
5. Backend stocke le token (chiffre au repos).
6. Requetes authentifiees vers GraphQL avec `Authorization: Bearer <token>`.

## 4) Contrat HTTP AniList a respecter

Requete type:

```http
POST / HTTP/1.1
Host: graphql.anilist.co
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token-optionnel>

{
  "query": "query ($id: Int) { Media(id: $id) { id title { romaji } } }",
  "variables": { "id": 15125 }
}
```

Regles importantes:

- Toujours utiliser `POST`.
- Fournir `query` et idealement `variables`.
- Verifier `errors` meme avec status HTTP `200`.

## 5) Pagination AniList (detail critique)

Pattern:

- Utiliser l'objet top-level `Page` pour recuperer plusieurs elements.
- Utiliser `page` + `perPage` dans les variables.
- Boucler tant que `pageInfo.hasNextPage == true`.

Limitation officielle:

- Dans un meme `Page`, une seule collection de donnees (ex: `media` OU `characters`) est autorisee.
- `pageInfo.total` et `pageInfo.lastPage` peuvent etre inexacts; preferer `hasNextPage`.

## 6) Gestion d'erreurs robuste

AniList peut renvoyer:

- Erreurs de validation GraphQL (`status: 400` avec champ `validation`).
- Erreurs metier GraphQL.
- `429 Too Many Requests` avec `Retry-After`.

Strategie backend recommandee:

1. Si HTTP `429`: respecter `Retry-After` + retry borne.
2. Si HTTP `5xx`: retry exponentiel avec jitter (max 2-3 tentatives).
3. Si `errors` GraphQL avec HTTP 200: transformer en erreur metier propre.
4. Logger `operationName`, hash de query, userId technique, latence.

## 7) Securite

- Ne jamais exposer `client_secret` au frontend.
- Stocker `access_token` chiffre (DB + KMS/secret manager si possible).
- Proteger callback OAuth contre CSRF via parametre `state` (fortement recommande).
- Ajouter timeout reseau strict (ex: 5-10s) sur appels AniList.
- Sanitizer et validation stricte des inputs avant interpolation dans variables GraphQL.

## 8) Performance

- Batch logique cote backend (pas besoin de multiplier les appels si une query plus riche suffit).
- Limiter les champs GraphQL au strict necessaire.
- Cache agressif pour metadata stables (genres, studios, tags) avec TTL long.
- Degrader gracieusement en cas de quota atteint (reponse partielle, fallback cache).

## 9) Conformite ToS AniList

- Pas de hoarding/mass collection de donnees.
- Ne pas utiliser AniList comme stockage de backup.
- Respecter naming guidelines (mention "UNOFFICIAL" ou "for AniList" selon les cas).
- Usage commercial > 150 USD/mois: licence commerciale a discuter avec AniList.

## 10) Exemple d'implementation backend (TypeScript)

```ts
// lib/anilistClient.ts
export type AniListResponse<T> = {
  data: T | null;
  errors?: Array<{ message: string; status?: number; validation?: Record<string, string[]> }>;
};

const ANILIST_GQL = "https://graphql.anilist.co";

export async function anilistRequest<T>(params: {
  query: string;
  variables?: Record<string, unknown>;
  accessToken?: string;
  timeoutMs?: number;
}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), params.timeoutMs ?? 10_000);

  try {
    const res = await fetch(ANILIST_GQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(params.accessToken ? { Authorization: `Bearer ${params.accessToken}` } : {}),
      },
      body: JSON.stringify({ query: params.query, variables: params.variables ?? {} }),
      signal: controller.signal,
    });

    const json = (await res.json()) as AniListResponse<T>;

    // GraphQL peut echouer avec HTTP 200: toujours inspecter errors.
    if (json.errors?.length) {
      const first = json.errors[0];
      throw new Error(`AniList GraphQL error: ${first.status ?? "unknown"} ${first.message}`);
    }

    if (!res.ok || !json.data) {
      throw new Error(`AniList HTTP error: ${res.status}`);
    }

    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}
```

```ts
// lib/anilistPagination.ts
export async function fetchAllMediaBySearch(search: string, perPage = 25) {
  const query = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { currentPage hasNextPage }
        media(search: $search, type: ANIME) {
          id
          title { romaji english }
        }
      }
    }
  `;

  const result: Array<{ id: number; title: { romaji?: string; english?: string } }> = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await anilistRequest<{
      Page: {
        pageInfo: { currentPage: number; hasNextPage: boolean };
        media: Array<{ id: number; title: { romaji?: string; english?: string } }>;
      };
    }>({ query, variables: { page, perPage, search } });

    result.push(...data.Page.media);
    hasNextPage = data.Page.pageInfo.hasNextPage;
    page += 1;
  }

  return result;
}
```

## 11) Edge cases a anticiper

- Token expire (pas de refresh token): forcer re-login proprement.
- Changement temporaire des quotas (degrade mode): adaptation dynamique par headers.
- Reponse partielle GraphQL + errors: ne pas supposer `data` complet.
- Champ deprecated/supprime cote schema: proteger via tests de contrat.

## 12) Checklist production

- OAuth state + anti-CSRF en place.
- Secrets en vault/ENV securise.
- Retry borne + jitter + timeout.
- Cache + invalidation post-mutation.
- Monitoring 429 / 5xx / latence p95.
- Tests integration sur principales queries/mutations.
- Revue ToS et branding avant mise en prod.

## Sources Web (officielles)

- https://docs.anilist.co/
- https://docs.anilist.co/guide/graphql/
- https://docs.anilist.co/guide/graphql/pagination
- https://docs.anilist.co/guide/graphql/errors
- https://docs.anilist.co/guide/auth/
- https://docs.anilist.co/guide/auth/authorization-code
- https://docs.anilist.co/guide/auth/implicit
- https://docs.anilist.co/guide/auth/authenticated-requests
- https://docs.anilist.co/guide/rate-limiting
- https://docs.anilist.co/guide/terms-of-use
