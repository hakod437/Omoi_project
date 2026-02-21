# Omoi - Technology Stack Guide 🚀

Ce document explique l'écosystème technique choisi pour le projet **Omoi**. Chaque outil a été sélectionné pour maximiser la performance, la maintenabilité et l'expérience utilisateur (UX).

---

## 🏗️ 1. Framework & Langage

### [Next.js (App Router)](https://nextjs.org/)
*   **Rôle** : La colonne vertébrale du projet.
*   **Pourquoi ?** : Nous utilisons le **App Router** pour ses performances (Server Components) et ses optimisations natives (images, polices, routing).
*   **Concept Clé** : Les pages sont rendues côté serveur par défaut, ce qui rend l'application extrêmement rapide au premier chargement.

### [React 19](https://react.dev/)
*   **Rôle** : Bibliothèque d'interface utilisateur.
*   **Pourquoi ?** : La version 19 apporte des optimisations de rendu et une meilleure gestion des formulaires (`useActionState`, etc.).

### [TypeScript](https://www.typescriptlang.org/)
*   **Rôle** : Sécurité et documentation du code.
*   **Pourquoi ?** : Permet d'attraper les erreurs avant même de lancer l'application et offre une autocomplétion parfaite dans l'éditeur.

---

## 🎨 2. Styling & Design System

### [Tailwind CSS](https://tailwindcss.com/)
*   **Rôle** : Framework CSS utilitaire.
*   **Pourquoi ?** : Permet de styliser les composants sans quitter le fichier HTML/TSX. Très performant car il ne génère que le CSS utilisé.
*   **Usage** : Utilisé via des variables CSS (`var(--primary)`) pour permettre le changement de thèmes.

### [Shadcn UI](https://ui.shadcn.com/)
*   **Rôle** : Collection de composants réutilisables (Atoms).
*   **Pourquoi ?** : Ce n'est pas une bibliothèque de composants lourde, mais du code que l'on possède. Il utilise **Radix UI** pour l'accessibilité.

---

## 🎬 3. Animations & Effets Visuels

### [Framer Motion](https://www.framer.com/motion/)
*   **Rôle** : Moteur d'animations complexe.
*   **Pourquoi ?** : C'est l'outil qui gère notre **Mesh Gradient** (le fond Aurora) et les transitions fluides entre les onglets de connexion.
*   **Concept Clé** : `layoutId`. Il permet de faire glisser une pilule de sélection d'un bouton à l'autre de manière organique.

---

## 🛠️ 4. Utilitaires & Expérience Développeur

### [Sonner](https://sonner.emilkowal.ski/)
*   **Rôle** : Système de notifications (Toasts).
*   **Pourquoi ?** : Léger, performant et très esthétique par défaut. Idéal pour confirmer une connexion ou signaler une erreur.

### [Lucide React](https://lucide.dev/)
*   **Rôle** : Bibliothèque d'icônes.
*   **Pourquoi ?** : Des icônes vectorielles légères, personnalisables et cohérentes.

### [Next Themes](https://github.com/pacocoursey/next-themes)
*   **Rôle** : Gestionnaire de thèmes (Dark/Light/Custom).
*   **Pourquoi ?** : Gère proprement l'attribut `data-theme` et évite le "flash" blanc au chargement de la page.

---

## 📦 5. Infrastructure & Données

### [Turborepo](https://turbo.build/)
*   **Rôle** : Orchestrateur de Monorepo.
*   **Pourquoi ?** : Permet de gérer plusieurs applications (`web`, `docs`) et des packages partagés (`ui`, `config`) dans un seul dépôt avec des builds ultra-rapides grâce au cache.

### [Supabase](https://supabase.com/)
*   **Rôle** : Backend-as-a-Service (BaaS).
*   **Pourquoi ?** : Fournit une authentification robuste, une base de données PostgreSQL temps réel et un stockage de fichiers sans avoir à gérer de serveur.

---

> [!TIP]
> **Philosophie du Projet** : Nous suivons les principes de l'**Atomic Design**. Les composants sont décomposés en *Atoms* (boutons), *Molecules* (champs de formulaire) et *Organisms* (formulaires complets) pour une réutilisation maximale.
