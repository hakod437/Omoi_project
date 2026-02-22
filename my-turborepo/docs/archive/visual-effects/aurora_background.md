# Archive: Aurora Fluid Background 🌊

Ce document conserve precieusement la logique du fond anime "Aurora" (Mesh Gradient Visqueux) tel qu'il etait avant le passage au fond adaptatif simplifie.

## ⚛️ React Component
**Source**: `apps/web/app/components/organisms/aurora-background.tsx`

```tsx
/**
 * AuroraBackground: Composant d'effet visuel "Mesh Gradient".
 * - Role: Atmo-sphère décorative (Organism car il définit l'ambiance globale).
 * - Strategy: Utilise des blobs CSS floutés et animés.
 * - Accessibility: aria-hidden="true" car purement décoratif.
 */
export default function AuroraBackground() {
    return (
        <div className="fluid-container" aria-hidden="true">
            <div className="blob color-1"></div>
            <div className="blob color-2"></div>
            <div className="blob color-3"></div>
        </div>
    );
}
```

## 🎨 CSS Logic
**Source**: `apps/web/styles/index.css`

```css
/* 1. THE FLUID CONTAINER */
.fluid-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background);
    overflow: hidden;
    z-index: -1;
}

/* 2. THE BLOBS (Mesh Gradient Logic) */
.blob {
    position: absolute;
    width: 70vw; 
    height: 70vw;
    border-radius: 50%;
    filter: blur(140px);
    opacity: 0.45; 
    will-change: transform;
    mix-blend-mode: normal;
}

/* 3. THEME BINDINGS */
.color-1 {
    background: var(--blob-1);
    top: -10%;
    left: -10%;
    animation: mesh-move-1 12s infinite alternate ease-in-out;
}

.color-2 {
    background: var(--blob-2);
    bottom: -10%;
    right: -10%;
    animation: mesh-move-2 15s infinite alternate ease-in-out;
}

.color-3 {
    background: var(--blob-3);
    top: 20%;
    right: 20%;
    animation: mesh-move-3 14s infinite alternate ease-in-out;
}

/* 4. VISCOUS MOVEMENT MATH */
@keyframes mesh-move-1 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20%, 30%) scale(1.2); }
    100% { transform: translate(-10%, 10%) scale(1.1); }
}

@keyframes mesh-move-2 {
    0% { transform: translate(0, 0) scale(1.1); }
    50% { transform: translate(-30%, -20%) scale(0.9); }
    100% { transform: translate(10%, -10%) scale(1.2); }
}

@keyframes mesh-move-3 {
    0% { transform: translate(0, 0); }
    50% { transform: translate(-15%, 40%); }
    100% { transform: translate(30%, -20%); }
}

/* 5. CONTENT TRANSPARENCY */
body {
    background-color: transparent !important;
}
```

## 📝 Configuration des Thèmes liés
Les variables `--blob-1`, `--blob-2` et `--blob-3` sont définies dans `theme.css` pour chaque thème (Pastel, Cyber, Shonen).
