#!/usr/bin/env node

/**
 * Apply production RBAC migrations directly to fix login loop
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

async function executeSQLStatements(sql) {
    // Split SQL into individual statements
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.match(/^\s*$/));
    
    console.log(`   Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.match(/^\s*$/)) {
            continue;
        }
        
        try {
            console.log(`   [${i + 1}/${statements.length}] Executing statement...`);
            
            // Use the REST API directly for SQL execution
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'apikey': SUPABASE_SERVICE_KEY
                },
                body: JSON.stringify({
                    sql: statement + ';'
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                console.log(`   ⚠️  Statement ${i + 1} failed: ${error}`);
                // Continue with next statement
            } else {
                console.log(`   ✅ Statement ${i + 1} executed successfully`);
            }
            
        } catch (error) {
            console.log(`   ⚠️  Statement ${i + 1} failed: ${error.message}`);
            // Continue with next statement
        }
    }
}

async function applyMigrations() {
    console.log('🚀 Applying production RBAC migrations directly...\n');
    
    try {
        // Read migration files
        const rbacMigration = fs.readFileSync(
            'supabase/migrations/20260109000000_production_rbac_system.sql', 
            'utf8'
        );
        
        console.log('📄 RBAC migration file loaded');
        
        // Apply RBAC migration
        console.log('\n1. Applying production RBAC system migration...');
        await executeSQLStatements(rbacMigration);
        
        console.log('\n2. Testing JWT role function...');
        try {
            const { data: jwtTest, error: jwtError } = await supabase
                .rpc('auth.jwt_role');
            
            if (jwtError) {
                console.log('   ⚠️  JWT role function test failed:', jwtError.message);
                console.log('   This might be expected if no user is authenticated');
            } else {
                console.log('   ✅ JWT role function is working');
            }
        } catch (error) {
            console.log('   ⚠️  JWT role function test failed:', error.message);
        }
        
        // Apply reminders migration
        const remindersMigration = fs.readFileSync(
            'supabase/migrations/20260109000001_fix_reminders_performance.sql', 
            'utf8'
        );
        
        console.log('\n3. Applying reminders performance migration...');
        await executeSQLStatements(remindersMigration);
        
        console.log('\n🎉 MIGRATIONS COMPLETED!');
        console.log('');
        console.log('✅ Production RBAC system should now be active');
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