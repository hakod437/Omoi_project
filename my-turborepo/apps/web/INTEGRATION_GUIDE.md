# Guide d'intégration Frontend - Omoi

## 🎯 Résumé

Tu as 3 outils prêts à l'emploi :
1. **`api`** - Client API typé
2. **`useAnimes()`** - Hook pour les animes
3. **`useFriends()`** - Hook pour les amis
4. **`useAuth()`** - Hook pour l'authentification

---

## 1. Authentification

```tsx
import { useAuth } from '@/contexts/auth-context';

function MonComposant() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Non connecté</p>;

  return (
    <div>
      <p>Bonjour {profile?.display_name}</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
}
```

---

## 2. Liste des animes

```tsx
import { useAnimes } from '@/hooks';

function MesAnimes() {
  const { animes, loading, error, addAnime, removeAnime } = useAnimes();

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      {animes.map(anime => (
        <div key={anime.id}>
          <h3>{anime.title}</h3>
          <p>Ma note: {anime.user_rating}/6</p>
          <button onClick={() => removeAnime(anime.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
```

### Ajouter un anime

```tsx
const { addAnime } = useAnimes();

await addAnime({
  malId: 1234,           // ID MyAnimeList
  userRating: 5,         // 1-6
  animationRating: 4,    // 1-6
  userDescription: "Trop bien!"
});
```

---

## 3. Système d'amis

```tsx
import { useFriends } from '@/hooks';

function MesAmis() {
  const { 
    friends,           // Liste des amis
    pendingRequests,   // Demandes reçues
    sentRequests,      // Demandes envoyées
    sendRequest,       // Envoyer demande
    acceptRequest,     // Accepter
    rejectRequest,     // Refuser
    removeFriend       // Supprimer
  } = useFriends();

  return (
    <div>
      <h2>Demandes en attente ({pendingRequests.length})</h2>
      {pendingRequests.map(req => (
        <div key={req.friendship_id}>
          <span>{req.friend_name}</span>
          <button onClick={() => acceptRequest(req.friendship_id)}>✓</button>
          <button onClick={() => rejectRequest(req.friendship_id)}>✗</button>
        </div>
      ))}

      <h2>Mes amis ({friends.length})</h2>
      {friends.map(friend => (
        <div key={friend.friendship_id}>
          <span>{friend.friend_name}</span>
          <span>{friend.animeCount} animes</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Recherche d'utilisateurs

```tsx
import { api } from '@/lib/api';

async function rechercherUtilisateur(query: string) {
  const response = await api.user.search(query);
  if (response.success) {
    return response.data; // Liste d'utilisateurs
  }
}
```

---

## 5. API directe (si tu préfères)

```tsx
import { api } from '@/lib/api';

// Animes
const { data: animes } = await api.anime.getList({ page: 1, limit: 20 });
const { data: results } = await api.anime.search("Naruto");
await api.anime.add({ malId: 1234, userRating: 5, animationRating: 4 });
await api.anime.update("uuid-id", { userRating: 6 });
await api.anime.remove("uuid-id");

// Users
const { data: profile } = await api.user.getProfile(true); // true = avec stats
await api.user.updateProfile({ displayName: "Nouveau nom" });

// Friends
await api.friends.sendRequest("user-uuid");
await api.friends.accept("friendship-uuid");
await api.friends.reject("friendship-uuid");
await api.friends.remove("friendship-uuid");
```

---

## 📁 Fichiers clés

| Fichier | Description |
|---------|-------------|
| `lib/api/client.ts` | Toutes les fonctions API |
| `hooks/use-animes.ts` | Hook animes |
| `hooks/use-friends.ts` | Hook amis |
| `contexts/auth-context.tsx` | Context auth |
| `types/database.ts` | Types TypeScript |

---

## ⚡ Exemple complet : Remplacer AnimeProvider

Dans ton composant principal, remplace :

```tsx
// AVANT (mock data)
const { animes } = useContext(AnimeContext);

// APRÈS (vraie API)
const { animes, loading, addAnime, removeAnime } = useAnimes();
```

C'est tout ! 🎉
