#!/usr/bin/env node

// Test workflow complet avec correction session
console.log('🔐 TEST WORKFLOW COMPLET - SESSION CORRIGÉE\n');

const BASE_URL = 'http://localhost:3000';

async function testCompleteWorkflow() {
    try {
        console.log('🔄 Workflow complet...\n');
        
        // Étape 1: Test pages accessibles
        console.log('1. Test accès pages...');
        const loginPage = await fetch(`${BASE_URL}/login`);
        const registerPage = await fetch(`${BASE_URL}/register`);
        console.log(`   Login: ${loginPage.ok ? '✅' : '❌'} (${loginPage.status})`);
        console.log(`   Register: ${registerPage.ok ? '✅' : '❌'} (${registerPage.status})`);
        
        // Étape 2: Connexion
        console.log('\n2. Connexion...');
        const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
        const csrfData = await csrfResponse.json();
        
        const loginData = new URLSearchParams();
        loginData.append('phoneNumber', '+33612345678');
        loginData.append('password', 'testpass123');
        loginData.append('displayName', 'Test User');
        loginData.append('csrfToken', csrfData.csrfToken);
        loginData.append('callbackUrl', '/');
        
        const loginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: loginData.toString(),
            redirect: 'manual'
        });
        
        const location = loginResponse.headers.get('location');
        const cookies = loginResponse.headers.get('set-cookie') || '';
        
        console.log(`   Status: ${loginResponse.status}`);
        console.log(`   Location: ${location}`);
        console.log(`   Cookies: ${cookies ? 'Présents' : 'Manquants'}`);
        
        if (location && !location.includes('error')) {
            console.log('   ✅ Connexion réussie');
        } else {
            console.log('   ❌ Connexion échouée');
            return false;
        }
        
        // Étape 3: Test dashboard avec cookies
        console.log('\n3. Test dashboard avec session...');
        const dashboardResponse = await fetch(`${BASE_URL}/dashboard`, {
            headers: { 'Cookie': cookies }
        });
        
        console.log(`   Dashboard: ${dashboardResponse.ok ? '✅' : '❌'} (${dashboardResponse.status})`);
        
        if (dashboardResponse.ok) {
            console.log('   ✅ Session persistée correctement');
        } else {
            console.log('   ❌ Session non persistée');
            return false;
        }
        
        console.log('\n🎉 WORKFLOW TERMINÉ AVEC SUCCÈS !');
        return true;
        
    } catch (error) {
        console.error(`❌ Erreur workflow: ${error.message}`);
        return false;
    }
}

testCompleteWorkflow();
