---
description: Lancer l'application AnimeVault (Database + Dev Server)
---

Pour lancer le projet correctement, suivez ces étapes :

1. Lancer la base de données locale :
// turbo
```bash
npx prisma dev
```

2. Dans un nouveau terminal, lancer le serveur Next.js sur le port 3001 :
// turbo
```bash
npm run dev -- -p 3001
```

3. Ouvrez votre navigateur sur : [http://localhost:3001](http://localhost:3001)
