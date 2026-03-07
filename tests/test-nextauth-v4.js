#!/usr/bin/env node

// Test NextAuth v4
console.log('🧪 Test NextAuth v4...\n');

const BASE_URL = 'http://localhost:3000';

async function testNextAuthV4() {
    try {
        // Test 1: Vérifier si NextAuth répond
        console.log('1. Test endpoint NextAuth...');
        const response = await fetch(`${BASE_URL}/api/auth/providers`);
        
        if (response.ok) {
            console.log('   ✅ NextAuth accessible');
            const data = await response.json();
            console.log('   📊 Providers:', Object.keys(data));
        } else {
            console.log(`   ❌ Erreur: ${response.status}`);
            return false;
        }
        
        // Test 2: Vérifier CSRF
        console.log('\n2. Test CSRF...');
        const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`);
        
        if (csrfResponse.ok) {
            console.log('   ✅ CSRF accessible');
            const csrfData = await csrfResponse.json();
            console.log('   🔐 Token:', csrfData.csrfToken ? 'Présent' : 'Manquant');
        } else {
            console.log(`   ❌ Erreur CSRF: ${csrfResponse.status}`);
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.error(`❌ Erreur test: ${error.message}`);
        return false;
    }
}

testNextAuthV4();
