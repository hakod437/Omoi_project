# Templates de composants

Ce dossier contient les templates de composants réutilisables pour l'application AnimeVault.

## 📁 Structure

### Templates disponibles
- `HomeTemplate` - Template pour la page d'accueil
- `AnimeDetailTemplate` - Template pour la page de détail d'anime
- `DashboardTemplate` - Template pour le tableau de bord
- `AuthTemplate` - Template pour les pages d'authentification

## 🎨 Utilisation

Les templates sont conçus selon les principes d'Atomic Design:

### Exemple d'utilisation
```tsx
import { HomeTemplate } from '@/components/templates/HomeTemplate'

export default function HomePage() {
  return (
    <HomeTemplate>
      <h1>Bienvenue sur AnimeVault</h1>
      <p>Découvrez et notez vos animes préférés</p>
    </HomeTemplate>
  )
}
```

## 🎯 Recommandations

1. **Consistance** : Utilisez les mêmes patterns de styling
2. **Réutilisabilité** : Les templates doivent être flexibles
3. **Performance** : Évitez les re-renders inutiles
4. **Accessibilité** : Ajoutez les attributs ARIA appropriés
5. **Responsive** : Assurez-vous que les templates fonctionnent sur mobile

## 📝 Notes

- Les templates utilisent Tailwind CSS
- Ils sont compatibles avec le thème sombre/clair
- Ils incluent les animations et transitions définies
- Ils suivent les patterns de design kawaii/anime
