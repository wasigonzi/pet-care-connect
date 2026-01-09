#!/usr/bin/env node

/**
 * Diagnose login loop issues
 * This script checks the specific causes of login loops
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

async function diagnoseLoginLoop() {
    console.log('🔍 Diagnosing login loop issues...\n');
    
    try {
        // Test 1: Check if users exist
        console.log('1. Checking if users exist...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, role, full_name')
            .limit(5);
        
        if (profilesError) {
            console.log('   ❌ Error accessing profiles:', profilesError.message);
        } else {
            console.log(`   ✅ Found ${profiles.length} profiles`);
            profiles.forEach(p => {
                console.log(`      - ${p.full_name || 'No name'} (${p.role})`);
            });
        }
        
        // Test 2: Check RLS policies on profiles
        console.log('\n2. Testing RLS policies on profiles...');
        const { data: policies, error: policiesError } = await supabase
            .from('pg_policies')
            .select('policyname, cmd, roles, qual')
            .eq('tablename', 'profiles');
        
        if (policiesError) {
            console.log('   ❌ Error checking policies:', policiesError.message);
        } else {
            console.log(`   ✅ Found ${policies.length} policies on profiles table`);
            policies.forEach(p => {
                console.log(`      - ${p.policyname} (${p.cmd})`);
            });
        }
        
        // Test 3: Check if safe role function works
        console.log('\n3. Testing safe role function...');
        if (profiles && profiles.length > 0) {
            const testUserId = profiles[0].id;
            const { data: roleResult, error: roleError } = await supabase
                .rpc('get_user_role_safe', { user_id: testUserId });
            
            if (roleError) {
                console.log('   ❌ Safe role function failed:', roleError.message);
            } else {
                console.log(`   ✅ Safe role function works: ${roleResult}`);
            }
        }
        
        // Test 4: Check if JWT role function exists (should fail if migrations not applied)
        console.log('\n4. Testing JWT role function...');
        const { data: jwtTest, error: jwtError } = await supabase
            .rpc('auth.jwt_role');
        
        if (jwtError) {
            console.log('   ❌ JWT role function missing:', jwtError.message);
            console.log('   🔧 This is the main cause of login loops!');
        } else {
            console.log('   ✅ JWT role function exists');
        }
        
        // Test 5: Check middleware configuration
        console.log('\n5. Checking middleware configuration...');
        try {
            const middlewareContent = fs.readFileSync('middleware.ts', 'utf8');
            if (middlewareContent.includes('/login')) {
                console.log('   ⚠️  Middleware may be protecting /login route');
            } else {
                console.log('   ✅ Middleware configuration looks correct');
            }
        } catch (error) {
            console.log('   ❌ Could not read middleware.ts');
        }
        
        // Summary and recommendations
        console.log('\n📋 DIAGNOSIS SUMMARY:');
        
        if (jwtError) {
            console.log('🚨 PRIMARY ISSUE: Production RBAC migrations not applied');
            console.log('');
            console.log('🔧 SOLUTION:');
            console.log('   1. Go to Supabase Dashboard SQL Editor');
            console.log('   2. Apply: supabase/migrations/20260109000000_production_rbac_system.sql');
            console.log('   3. Apply: supabase/migrations/20260109000001_fix_reminders_performance.sql');
            console.log('   4. Test login again');
            console.log('');
            console.log('🔗 Direct link:');
            console.log(`   ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/sql`);
        } else {
            console.log('✅ RBAC migrations appear to be applied');
            console.log('🔍 Login loop may be caused by other issues:');
            console.log('   - Check browser console for JavaScript errors');
            console.log('   - Check middleware.ts for route protection issues');
            console.log('   - Verify environment variables are correct');
        }
        
    } catch (error) {
        console.error('💥 Diagnosis failed:', error.message);
    }
}

diagnoseLoginLoop();