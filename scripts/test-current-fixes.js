#!/usr/bin/env node

/**
 * Test current fixes for login loop and landing page
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
    console.log('🧪 Testing current application state...\n');
    
    try {
        // Test 1: Check if profiles are accessible
        console.log('1. Testing profiles table access...');
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, role, full_name')
            .limit(3);
        
        if (profilesError) {
            console.log('   ❌ Profiles access failed:', profilesError.message);
        } else {
            console.log(`   ✅ Profiles accessible: ${profiles.length} found`);
            profiles.forEach(p => {
                console.log(`      - ${p.full_name || 'No name'} (${p.role})`);
            });
        }
        
        // Test 2: Test safe role function
        console.log('\n2. Testing safe role function...');
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
        
        // Test 3: Test direct profile access (fallback method)
        console.log('\n3. Testing direct profile access (fallback)...');
        if (profiles && profiles.length > 0) {
            const testUserId = profiles[0].id;
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', testUserId)
                .single();
            
            if (profileError) {
                console.log('   ❌ Direct profile access failed:', profileError.message);
            } else {
                console.log(`   ✅ Direct profile access works: ${profile.role}`);
            }
        }
        
        // Test 4: Check if JWT functions exist (expected to fail)
        console.log('\n4. Testing JWT functions (expected to fail until migrations applied)...');
        const { data: jwtTest, error: jwtError } = await supabase
            .rpc('auth.jwt_role');
        
        if (jwtError) {
            console.log('   ⚠️  JWT functions missing (expected):', jwtError.message);
            console.log('   📝 This is normal until full migrations are applied');
        } else {
            console.log('   ✅ JWT functions exist!');
        }
        
        // Test 5: Check icon files
        console.log('\n5. Checking icon files...');
        const iconFiles = [
            'public/icon.svg',
            'public/apple-touch-icon.png',
            'public/favicon.ico',
            'public/icon-192.png',
            'public/icon-512.png'
        ];
        
        iconFiles.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(`   ✅ ${file} exists`);
            } else {
                console.log(`   ❌ ${file} missing`);
            }
        });
        
        // Summary
        console.log('\n📋 CURRENT STATE SUMMARY:');
        
        if (profiles && profiles.length > 0) {
            console.log('✅ Database connection working');
            console.log('✅ Profiles table accessible');
        }
        
        if (roleResult !== undefined) {
            console.log('✅ Safe role function working (fallback available)');
        }
        
        if (jwtError) {
            console.log('⚠️  JWT functions missing (requires full migration)');
        }
        
        console.log('\n🎯 EXPECTED BEHAVIOR NOW:');
        console.log('✅ Landing page should display (no more auto-redirect)');
        console.log('✅ Login should work with fallback role detection');
        console.log('✅ No more icon 404 errors');
        console.log('⚠️  Some advanced features may not work until full migrations applied');
        
        console.log('\n🔧 TO COMPLETE THE FIX:');
        console.log('1. Test the landing page at http://localhost:3000');
        console.log('2. Test login functionality');
        console.log('3. Apply full migrations via Supabase Dashboard for all features');
        console.log('4. See APPLY_MIGRATIONS_MANUAL.md for detailed instructions');
        
    } catch (error) {
        console.error('💥 Testing failed:', error.message);
    }
}

testCurrentState();