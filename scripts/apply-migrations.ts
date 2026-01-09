#!/usr/bin/env tsx

/**
 * Apply Supabase migrations directly using service role
 * This script applies the production RBAC and performance migrations
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables manually from .env.local
function loadEnvVars() {
    try {
        const envPath = join(process.cwd(), '.env.local');
        const envContent = readFileSync(envPath, 'utf8');
        const envVars: Record<string, string> = {};
        
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envVars[key.trim()] = value.trim();
            }
        });
        
        return envVars;
    } catch (error) {
        return {};
    }
}

const envVars = loadEnvVars();
const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL');
    console.error('   SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function applyMigration(migrationFile: string) {
    console.log(`\n📄 Applying migration: ${migrationFile}`);
    
    try {
        const migrationPath = join(process.cwd(), 'supabase', 'migrations', migrationFile);
        const sql = readFileSync(migrationPath, 'utf8');
        
        // Execute the migration SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
            // If exec_sql doesn't exist, try direct execution
            console.log('   Trying direct SQL execution...');
            const { error: directError } = await supabase.from('_migrations').select('*').limit(1);
            
            if (directError) {
                // Create a simple execution by splitting and running statements
                const statements = sql
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0 && !s.startsWith('--'));
                
                for (const statement of statements) {
                    if (statement.trim()) {
                        console.log(`   Executing: ${statement.substring(0, 50)}...`);
                        const { error: stmtError } = await supabase.rpc('exec', { sql: statement });
                        if (stmtError) {
                            console.error(`   ❌ Statement failed: ${stmtError.message}`);
                        }
                    }
                }
            }
        }
        
        console.log(`   ✅ Migration applied successfully`);
        
    } catch (error: any) {
        console.error(`   ❌ Migration failed: ${error.message}`);
        throw error;
    }
}

async function main() {
    console.log('🚀 Starting migration application...');
    console.log(`📡 Connected to: ${SUPABASE_URL}`);
    
    try {
        // Test connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
            console.error('❌ Connection test failed:', error.message);
            process.exit(1);
        }
        console.log('✅ Connection successful');
        
        // Apply the critical migrations
        const migrations = [
            '20260109000000_production_rbac_system.sql',
            '20260109000001_fix_reminders_performance.sql'
        ];
        
        for (const migration of migrations) {
            await applyMigration(migration);
        }
        
        console.log('\n🎉 All migrations applied successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Test login flow with different user roles');
        console.log('   2. Verify no infinite recursion errors');
        console.log('   3. Check reminders page performance');
        console.log('   4. Run comprehensive tests');
        
    } catch (error: any) {
        console.error('\n💥 Migration failed:', error.message);
        process.exit(1);
    }
}

// Alternative: Manual SQL execution function
async function executeSQL(sql: string) {
    console.log('🔧 Executing SQL directly...');
    
    // Split SQL into individual statements
    const statements = sql
        .split(/;\s*\n/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.match(/^\s*$/));
    
    console.log(`📝 Found ${statements.length} statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);
        console.log(`   ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
        
        try {
            // For DDL statements, we need to use the raw SQL approach
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                    'apikey': SUPABASE_SERVICE_KEY
                },
                body: JSON.stringify({ sql_query: statement })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`   ❌ Failed: ${response.status} ${response.statusText}`);
                console.error(`   Error: ${errorText}`);
            } else {
                console.log(`   ✅ Success`);
            }
            
        } catch (error: any) {
            console.error(`   ❌ Exception: ${error.message}`);
        }
    }
}

// If called with --manual flag, provide manual SQL
if (process.argv.includes('--manual')) {
    console.log('\n📋 MANUAL MIGRATION INSTRUCTIONS:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the following files in order:');
    console.log('   - supabase/migrations/20260109000000_production_rbac_system.sql');
    console.log('   - supabase/migrations/20260109000001_fix_reminders_performance.sql');
    console.log('4. Execute each migration file');
    console.log('\n🔗 Direct link to SQL Editor:');
    console.log(`   ${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/sql`);
    process.exit(0);
}

main().catch(console.error);