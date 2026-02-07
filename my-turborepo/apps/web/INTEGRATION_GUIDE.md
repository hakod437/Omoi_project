# Backend API

## Hooks

```tsx
import { useAuth } from '@/contexts/auth-context';
import { useAnimes, useFriends } from '@/hooks';
```

| Hook | Returns |
|------|---------|
| `useAuth()` | `{ user, profile, loading, signOut, refreshProfile }` |
| `useAnimes()` | `{ animes, loading, error, addAnime, updateAnime, removeAnime, refetch }` |
| `useFriends()` | `{ friends, pendingRequests, sentRequests, sendRequest, acceptRequest, rejectRequest, removeFriend }` |

## API Client

```tsx
import { api } from '@/lib/api';
```

- `api.anime.*` - CRUD + search
- `api.user.*` - Profile
- `api.friends.*` - Friendships

## Types

Voir `types/database.ts` et `types/api.ts`
