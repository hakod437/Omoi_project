# Tests AnimeVault

Ce dossier contient la suite complète de tests pour l'application AnimeVault.

## 📁 Structure des tests

### Tests d'Authentification
- `test-complete-auth.js` - Tests complets du système d'authentification
- `test-e2e-integration.js` - Tests d'intégration end-to-end

### Tests de Performance
- `test-performance.js` - Tests de performance, charge et sécurité

### Scripts d'Exécution
- `run-all-tests.sh` - Script complet qui lance tous les tests

## 🚀 Usage

### Lancer tous les tests:
```bash
cd tests
./run-all-tests.sh
```

### Lancer un test spécifique:
```bash
# Tests d'authentification complets
node test-complete-auth.js

# Tests de performance
node test-performance.js

# Tests d'intégration
node test-e2e-integration.js
```

## 📊 Fonctionnalités testées

### Authentification
- ✅ Pages login/register accessibles
- ✅ Champs displayName présents
- ✅ Validation des formulaires
- ✅ Gestion des erreurs
- ✅ Sessions utilisateur
- ✅ CSRF protection

### Performance
- ✅ Temps de chargement des pages
- ✅ Gestion de charge (multiple requêtes)
- ✅ Gestion des sessions multiples
- ✅ Sécurité basique (injection, XSS)
- ✅ Accessibilité basique

### Intégration
- ✅ Workflow utilisateur complet
- ✅ Validation des edge cases
- ✅ Compatibilité navigateur
- ✅ Gestion des erreurs
- ✅ Monitoring et santé

## 🔐 Identifiants de test

### Utilisateur de test principal
- **Phone Number**: `+33612345678`
- **Password**: `testpass123`
- **Display Name**: `Test User`

### Utilisateurs générés automatiquement
- Numéros aléatoires: `+336xxxxxxxx`
- Mot de passe: 6+ caractères
- Usernames uniques avec timestamp

## 📝 Notes importantes

1. **Base de données**: Les tests utilisent une authentication mock
2. **Production**: Pour la production, configurez PostgreSQL et réactivez PrismaAdapter
3. **Sécurité**: Les tests sont basiques, ajoutez des tests de sécurité approfondis
4. **Performance**: Les métriques sont relatives, dépendent de la machine

## 🎯 Prochaines étapes

1. **Configurer la base de données PostgreSQL**
2. **Ajouter des tests unitaires** (Jest/Vitest)
3. **Configurer CI/CD** (GitHub Actions)
4. **Ajouter monitoring** (Sentry, LogRocket)
5. **Optimiser pour la production** (images, assets, bundle size)
