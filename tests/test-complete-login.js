#!/usr/bin/env node

// Test complet de connexion NextAuth v4
console.log('🔐 TEST COMPLET CONNEXION - NextAuth v4\n');

const BASE_URL = 'http://localhost:3000';

async function testCompleteLogin() {
    try {
        console.log('🔄 Workflow de connexion complet...\n');
        
        // Étape 1: Obtenir CSRF token
        console.log('1. Obtention CSRF token...');
        const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
        const csrfData = await csrfResponse.json();
        console.log(`   ✅ CSRF Token: ${csrfData.csrfToken ? 'Obtenu' : 'Manquant'}`);
        
        // Étape 2: Connexion
        console.log('\n2. Connexion...');
        const loginData = new URLSearchParams();
        loginData.append('phoneNumber', '+33612345678');
        loginData.append('password', 'testpass123');
        loginData.append('displayName', 'Test User');
        loginData.append('csrfToken', csrfData.csrfToken);
        loginData.append('callbackUrl', '/');
        
        const loginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': csrfResponse.headers.get('set-cookie') || ''
            },
            body: loginData.toString(),
            redirect: 'manual'
        });
        
        const location = loginResponse.headers.get('location');
        const loginSuccess = location && !location.includes('error');
        
        console.log(`   Status: ${loginResponse.status}`);
        console.log(`   Location: ${location}`);
        
        if (loginSuccess) {
            console.log('   ✅ Connexion réussie');
        } else {
            console.log('   ❌ Connexion échouée');
            return false;
        }
        
        // Étape 3: Vérification session
        console.log('\n3. Vérification session...');
        const cookies = loginResponse.headers.get('set-cookie') || '';
        const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
            headers: { 'Cookie': cookies }
        });
        
        const session = await sessionResponse.json();
        
        if (session && session.user) {
            console.log('   ✅ Session active');
            console.log(`   👤 Utilisateur: ${session.user.name}`);
            console.log(`   🆔 ID: ${session.user.id}`);
            console.log(`   📧 Email: ${session.user.email}`);
        } else {
            console.log('   ❌ Session inactive');
            return false;
        }
        
        console.log('\n🎉 WORKFLOW TERMINÉ AVEC SUCCÈS !');
        return true;
        
    } catch (error) {
        console.error(`❌ Erreur workflow: ${error.message}`);
        return false;
    }
}

testCompleteLogin();
