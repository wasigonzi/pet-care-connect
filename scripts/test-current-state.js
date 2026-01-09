#!/usr/bin/env node

/**
 * Test current state of the application
 * This script checks if the production RBAC migrations have been applied
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase configuration');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function testCurrentState() {
    console.log('🔍 Testing current application state...\n');
    
    try {
        // Test 1: Check if JWT role function exists
        console.log('1. Testing JWT role function...');
        const { data: jwtTest, error: jwtError } = await supabase
            .rpc('auth.jwt_role');
        
        if (jwtError) {
            console.log('   ❌ JWT role function not found - migrations not applied');
            console.log(`   Error: ${jwtError.message}`);
        } else {
            console.log('   ✅ JWT role function exists');
        }
        
        // Test 2: Check if safe role function exists
        console.log('\n2. Testing safe role function...');
        const { data: safeTest, error: safeError } = await supabase
            .rpc('get_user_role_safe');
        
        if (safeError) {
            console.log('   ❌ Safe role function not found - migrations not applied');
            console.log(`   Error: ${safeError.message}`);
        } else {
            console.log('   ✅ Safe role function exists');
        }
        
        // Test 3: Check reminders performance function
        console.log('\n3. Testing reminders pagination function...');
        const { data: reminderTest, error: reminderError } = await supabase
            .rpc('get_reminders_paginated', { page_size: 10, page_offset: 0 });
        
        if (reminderError) {
            console.log('   ❌ Reminders pagination function not found - migrations not applied');
            console.log(`   Error: ${reminderError.message}`);
        } else {
            console.log('   ✅ Reminders pagination function exists');
        }
        
        // Test 4: Check profiles table policies
        console.log('\n4. Testing profiles table access...');
        const { data: profilesTest, error: profilesError } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
        
        if (profilesError) {
            console.log('   ❌ Profiles table access failed');
            console.log(`   Error: ${profilesError.message}`);
        } else {
            console.log('   ✅ Profiles table accessible');
        }
        
        // Summary
        console.log('\n📋 SUMMARY:');
        const allFunctionsExist = !jwtError && !safeError && !reminderError;
        
        if (allFunctionsExist) {
            console.log('✅ Production RBAC migrations appear to be applied');
            console.log('✅ System should be ready for testing');
            console.log('\n🚀 Next steps:');
            console.log('   1. Test login flow: npm run dev');
            console.log('   2. Visit /login and test with different users');
            console.log('   3. Check /dashboard/reminders performance');
            console.log('   4. Run tests: npm run test');
        } else {
            console.log('❌ Production RBAC migrations NOT applied');
            console.log('\n🔧 Required actions:');
            console.log('   1. Go to Supabase Dashboard SQL Editor');
            console.log('   2. Apply: supabase/migrations/20260109000000_production_rbac_system.sql');
            console.log('   3. Apply: supabase/migrations/20260109000001_fix_reminders_performance.sql');
            console.log('   4. Re-run this test');
            console.log('\n🔗 Direct link:');
            console.log(`   ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/sql`);
        }
        
    } catch (error) {
        console.error('💥 Test failed:', error.message);
    }
}

testCurrentState();