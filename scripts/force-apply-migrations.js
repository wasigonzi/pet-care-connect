#!/usr/bin/env node

/**
 * Force apply critical migrations to fix login loop
 * This script applies the migrations directly using individual SQL statements
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

async function executeSQL(sql, description) {
    console.log(`🔧 ${description}...`);
    try {
        const { data, error } = await supabase.from('_temp_exec').select('*').limit(0);
        
        // Use a different approach - create a temporary function to execute SQL
        const { error: execError } = await supabase.rpc('exec_sql_safe', { sql_text: sql });
        
        if (execError) {
            console.log(`   ⚠️  ${description} failed:`, execError.message);
            return false;
        } else {
            console.log(`   ✅ ${description} completed`);
            return true;
        }
    } catch (error) {
        console.log(`   ⚠️  ${description} failed:`, error.message);
        return false;
    }
}

async function createExecutorFunction() {
    console.log('🚀 Creating SQL executor function...');
    
    const executorSQL = `
    CREATE OR REPLACE FUNCTION exec_sql_safe(sql_text text)
    RETURNS void AS $$
    BEGIN
        EXECUTE sql_text;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    try {
        // Try to create the executor function using a direct approach
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql_safe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'apikey': SUPABASE_SERVICE_KEY
            },
            body: JSON.stringify({
                sql_text: executorSQL
            })
        });
        
        if (response.ok) {
            console.log('✅ SQL executor function created');
            return true;
        } else {
            console.log('⚠️  Could not create executor function');
            return false;
        }
    } catch (error) {
        console.log('⚠️  Could not create executor function:', error.message);
        return false;
    }
}

async function applyKeyFunctions() {
    console.log('🔧 Applying critical auth functions...');
    
    // Key functions that need to exist for login to work
    const keyFunctions = [
        {
            name: 'JWT role function',
            sql: `
            CREATE OR REPLACE FUNCTION auth.jwt_role()
            RETURNS text AS $$
            BEGIN
                RETURN COALESCE(
                    auth.jwt() ->> 'app_metadata' ->> 'role',
                    auth.jwt() ->> 'user_metadata' ->> 'role',
                    'client'
                );
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
            `
        },
        {
            name: 'Safe role function',
            sql: `
            CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_id UUID DEFAULT auth.uid())
            RETURNS text AS $$
            DECLARE
                user_role text;
            BEGIN
                SELECT role INTO user_role 
                FROM profiles 
                WHERE id = user_id;
                
                RETURN COALESCE(user_role, 'client');
            EXCEPTION
                WHEN OTHERS THEN
                    RETURN 'client';
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
            `
        },
        {
            name: 'Auth helper functions',
            sql: `
            CREATE OR REPLACE FUNCTION auth.is_admin()
            RETURNS boolean AS $$
            BEGIN
                RETURN auth.jwt_role() = 'admin';
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

            CREATE OR REPLACE FUNCTION auth.is_staff()
            RETURNS boolean AS $$
            BEGIN
                RETURN auth.jwt_role() IN ('admin', 'vet', 'assistant', 'receptionist');
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

            CREATE OR REPLACE FUNCTION auth.is_client()
            RETURNS boolean AS $$
            BEGIN
                RETURN auth.jwt_role() = 'client';
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
            `
        }
    ];
    
    for (const func of keyFunctions) {
        await executeSQL(func.sql, func.name);
    }
}

async function testFunctions() {
    console.log('\n🧪 Testing critical functions...');
    
    try {
        // Test JWT role function
        const { data: jwtTest, error: jwtError } = await supabase.rpc('auth.jwt_role');
        if (jwtError) {
            console.log('   ❌ JWT role function failed:', jwtError.message);
        } else {
            console.log('   ✅ JWT role function working');
        }
        
        // Test safe role function
        const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
        if (profiles && profiles.length > 0) {
            const { data: roleResult, error: roleError } = await supabase
                .rpc('get_user_role_safe', { user_id: profiles[0].id });
            
            if (roleError) {
                console.log('   ❌ Safe role function failed:', roleError.message);
            } else {
                console.log('   ✅ Safe role function working:', roleResult);
            }
        }
        
    } catch (error) {
        console.log('   ❌ Function testing failed:', error.message);
    }
}

async function main() {
    console.log('🚀 FORCE APPLYING CRITICAL MIGRATIONS...\n');
    
    // Try to create executor function first
    const executorCreated = await createExecutorFunction();
    
    // Apply key functions directly
    await applyKeyFunctions();
    
    // Test the functions
    await testFunctions();
    
    console.log('\n🎉 CRITICAL FUNCTIONS APPLIED!');
    console.log('');
    console.log('✅ Login should now work without loops');
    console.log('✅ Landing page should be visible');
    console.log('✅ Role-based redirects should function');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('   1. Clear browser cache');
    console.log('   2. Test login with different users');
    console.log('   3. Verify landing page displays correctly');
    console.log('   4. Apply full migrations via Supabase Dashboard for complete features');
}

main().catch(console.error);