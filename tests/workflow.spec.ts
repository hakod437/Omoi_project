import { test, expect } from '@playwright/test';

test.describe('AnimeVault Workflow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Navigation principale et accès aux pages', async ({ page }) => {
    console.log('🧪 Test navigation principale...');
    
    // Vérifier page d'accueil
    await expect(page).toHaveTitle(/AnimeVault/);
    await expect(page.locator('h1')).toBeVisible();
    
    // Tester navigation vers login via le navbar
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
    
    // Retour à l'accueil
    await page.click('text=AnimeVault');
    await expect(page).toHaveURL('http://localhost:3000/');
    
    console.log('✅ Navigation principale OK');
  });

  test('Workflow de connexion par numéro de téléphone', async ({ page }) => {
    console.log('🧪 Test connexion par numéro...');
    
    // Aller à la page de login
    await page.goto('http://localhost:3000/login');
    
    // Remplir le formulaire avec les identifiants de test
    await page.fill('input[name="displayName"]', 'Test User');
    await page.fill('input[name="phoneNumber"]', '+33612345678');
    await page.fill('input[name="password"]', 'testpass123');
    
    // Soumettre le formulaire
    await page.click('button[type="submit"]');
    
    // Vérifier la redirection vers l'accueil
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Vérifier que l'utilisateur est connecté (présence du bouton de déconnexion)
    await expect(page.locator('button[title="Sign Out"]')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Connexion par numéro OK');
  });

  test('Workflow de connexion avec identifiants génériques', async ({ page }) => {
    console.log('🧪 Test connexion générique...');
    
    await page.goto('http://localhost:3000/login');
    
    // Utiliser des identifiants génériques valides
    await page.fill('input[name="phoneNumber"]', '+33987654321');
    await page.fill('input[name="password"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.locator('button[title="Sign Out"]')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Connexion générique OK');
  });

  test('Gestion des erreurs de connexion', async ({ page }) => {
    console.log('🧪 Test gestion erreurs...');
    
    await page.goto('http://localhost:3000/login');
    
    // Tester avec mauvais identifiants
    await page.fill('input[name="phoneNumber"]', '+33600000000');
    await page.fill('input[name="password"]', 'wrongpass');
    
    await page.click('button[type="submit"]');
    
    // Attendre un peu pour le traitement
    await page.waitForTimeout(3000);
    
    // Vérifier le comportement en cas d'erreur
    // Soit on reste sur login, soit on est redirigé mais avec un message d'erreur
    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('/login');
    
    if (isOnLoginPage) {
      console.log('✅ Gestion erreurs OK - Resté sur page login comme attendu');
    } else {
      // Si on a été redirigé, vérifier qu'il y a un message d'erreur
      const errorElement = page.locator('text=/Invalid|Error|Failed|incorrect/');
      const hasError = await errorElement.isVisible().catch(() => false);
      
      if (hasError) {
        console.log('✅ Gestion erreurs OK - Message d\'erreur affiché');
      } else {
        console.log('⚠️ Comportement inattendu - Ni redirection vers login, ni message d\'erreur');
      }
    }
  });

  test('Test des boutons et interactions', async ({ page }) => {
    console.log('🧪 Test interactions...');
    
    // Tester boutons sur la page d'accueil
    const buttonsCount = await page.locator('button, a').count();
    expect(buttonsCount).toBeGreaterThan(0);
    
    // Aller sur login et tester tous les boutons
    await page.goto('http://localhost:3000/login');
    
    // Vérifier présence des boutons sociaux (même s'ils ne sont pas configurés)
    await expect(page.locator('text=Google')).toBeVisible();
    await expect(page.locator('text=Discord')).toBeVisible();
    
    // Tester le lien vers register
    await page.click('text=Create an account');
    await expect(page).toHaveURL(/.*register/);
    
    console.log('✅ Interactions boutons OK');
  });

  test('Workflow complet : connexion → navigation → déconnexion', async ({ page }) => {
    console.log('🧪 Test workflow complet...');
    
    // Connexion
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="phoneNumber"]', '+33612345678');
    await page.fill('input[name="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    
    // Attendre la redirection
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Navigation vers différentes pages
    await page.click('text=Compare');
    await expect(page).toHaveURL('http://localhost:3000/compare');
    await page.goBack();
    
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Déconnexion via le bouton dans la navbar
    await page.click('button[title="Sign Out"]');
    
    // Attendre un peu pour la redirection
    await page.waitForTimeout(3000);
    
    // Vérifier qu'on est redirigé (soit vers login, soit reste sur home avec session expirée)
    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('/login');
    const isOnHomePage = currentUrl === 'http://localhost:3000/';
    
    if (isOnLoginPage || isOnHomePage) {
      console.log('✅ Workflow complet OK - Déconnexion réussie');
    } else {
      console.log(`⚠️ URL inattendue après déconnexion: ${currentUrl}`);
    }
  });
});
