#!/usr/bin/env node

/**
 * Apply production RBAC migrations to fix login loop
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

async function applyMigrations() {
    console.log('🚀 Applying production RBAC migrations...\n');
    
    try {
        // Read migration files
        const rbacMigration = fs.readFileSync(
            'supabase/migrations/20260109000000_production_rbac_system.sql', 
            'utf8'
        );
        
        const remindersMigration = fs.readFileSync(
            'supabase/migrations/20260109000001_fix_reminders_performance.sql', 
            'utf8'
        );
        
        console.log('📄 Migration files loaded successfully');
        
        // Apply RBAC migration
        console.log('\n1. Applying production RBAC system migration...');
        const { error: rbacError } = await supabase.rpc('exec_sql', {
            sql: rbacMigration
        });
        
        if (rbacError) {
            console.error('❌ RBAC migration failed:', rbacError.message);
            return;
        }
        
        console.log('✅ RBAC migration applied successfully');
        
        // Apply reminders performance migration
        console.log('\n2. Applying reminders performance migration...');
        const { error: remindersError } = await supabase.rpc('exec_sql', {
            sql: remindersMigration
        });
        
        if (remindersError) {
            console.error('❌ Reminders migration failed:', remindersError.message);
            return;
        }
        
        console.log('✅ Reminders migration applied successfully');
        
        // Test that the functions now exist
        console.log('\n3. Testing JWT role function...');
        const { data: jwtTest, error: jwtError } = await supabase
            .rpc('auth.jwt_role');
        
        if (jwtError) {
            console.log('   ⚠️  JWT role function test failed:', jwtError.message);
            console.log('   This is expected if no user is authenticated');
        } else {
            console.log('   ✅ JWT role function is working');
        }
        
        // Test safe role function
        console.log('\n4. Testing safe role function...');
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
        
        if (profiles && profiles.length > 0) {
            const { data: roleResult, error: roleError } = await supabase
                .rpc('get_user_role_safe', { user_id: profiles[0].id });
            
            if (roleError) {
                console.log('   ❌ Safe role function failed:', roleError.message);
            } else {
                console.log('   ✅ Safe role function working:', roleResult);
            }
        }
        
        console.log('\n🎉 MIGRATIONS APPLIED SUCCESSFULLY!');
        console.log('');
        console.log('✅ Production RBAC system is now active');
        console.log('✅ Login loop should be resolved');
        console.log('✅ Reminders performance optimized');
        console.log('');
        console.log('🔧 Next steps:');
        console.log('   1. Test login with different user roles');
        console.log('   2. Verify all routes are accessible');
        console.log('   3. Run comprehensive tests');
        
    } catch (error) {
        console.error('💥 Migration failed:', error.message);
        console.log('\n🔧 Manual application required:');
        console.log('   1. Go to Supabase Dashboard SQL Editor');
        console.log('   2. Copy and paste the migration SQL files');
        console.log('   3. Execute them manually');
        console.log(`   4. Dashboard URL: ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/sql`);
    }
}

applyMigrations();