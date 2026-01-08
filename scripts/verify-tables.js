import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkTables() {
    console.log("Checking Database Tables...");

    const envPath = path.resolve(__dirname, '../.env.local');
    if (!fs.existsSync(envPath)) {
        console.error("❌ .env.local not found!");
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim();
        }
    });

    const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
    const key = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    const supabase = createClient(url, key);

    const tablesToCheck = [
        'suppliers',
        'estimates',
        'estimate_items',
        'reminders',
        'templates',
        'wellness_plans',
        'communications',
        'inventory_items'
    ];

    let allGood = true;

    for (const table of tablesToCheck) {
        // We just select 0 rows to check if table exists (it basically throws if not, or returns empty list)
        const { error } = await supabase.from(table).select('id').limit(1);

        if (error) {
            if (error.code === '42P01') { // undefined_table
                console.error(`❌ Table '${table}' DOES NOT EXIST.`);
            } else {
                console.error(`⚠️ Error checking '${table}': ${error.message} (${error.code})`);
                // RLS might block SELECT even if table exists, checking err code is safer
            }
            allGood = false;
        } else {
            console.log(`✅ Table '${table}' exists.`);
        }
    }

    if (allGood) {
        console.log("\n🎉 All critical tables verified! The system should be fully functional.");
    } else {
        console.log("\n⚠️ Some tables are missing. Please re-run the specific migrations for the missing tables.");
    }
}

checkTables();
