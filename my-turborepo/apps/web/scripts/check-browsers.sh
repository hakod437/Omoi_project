#!/bin/bash

# Script pour vérifier et installer les navigateurs Playwright si nécessaire
# Évite de télécharger à chaque fois

echo "🔍 Vérification des navigateurs Playwright..."

# Vérifier si les navigateurs sont déjà installés
BROWSER_DIR="/home/hakuo/.cache/ms-playwright"
CHROMIUM_DIR="$BROWSER_DIR/chromium-1208"
FIREFOX_DIR="$BROWSER_DIR/firefox-1509"
WEBKIT_DIR="$BROWSER_DIR/webkit-2248"

BROWSERS_MISSING=false

# Vérifier chaque navigateur
if [ ! -d "$CHROMIUM_DIR" ]; then
    echo "❌ Chromium manquant"
    BROWSERS_MISSING=true
else
    echo "✅ Chromium installé"
fi

if [ ! -d "$FIREFOX_DIR" ]; then
    echo "❌ Firefox manquant"
    BROWSERS_MISSING=true
else
    echo "✅ Firefox installé"
fi

if [ ! -d "$WEBKIT_DIR" ]; then
    echo "❌ WebKit manquant"
    BROWSERS_MISSING=true
else
    echo "✅ WebKit installé"
fi

# Installer les navigateurs manquants si nécessaire
if [ "$BROWSERS_MISSING" = true ]; then
    echo ""
    echo "📦 Installation des navigateurs manquants..."
    npx playwright install
else
    echo ""
    echo "🎉 Tous les navigateurs sont déjà installés !"
fi

echo ""
echo "📊 Statut final :"
ls -la "$BROWSER_DIR" 2>/dev/null | grep -E "(chromium|firefox|webkit)" || echo "Aucun dossier de navigateur trouvé"
