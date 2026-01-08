import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testConnection() {
    console.log("Testing Supabase Connection...");

    // 1. Read .env.local manually
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

    if (!url || !key) {
        console.error("❌ Missing Supabase URL or Key in .env.local");
        return;
    }

    console.log(`URL: ${url}`);
    console.log(`Key (first 5 chars): ${key.substring(0, 5)}...`);

    // 2. Initialize Client
    const supabase = createClient(url, key);

    // 3. Test Query
    const start = Date.now();
    try {
        const { data, error, status } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        const duration = Date.now() - start;

        if (error) {
            console.error("❌ Connection Failed:", error.message);
            console.error("Details:", error);
        } else {
            console.log("✅ Connection Successful!");
            console.log(`Status: ${status}`);
            console.log(`Ping: ${duration}ms`);
        }

    } catch (e) {
        console.error("❌ Unexpected Error:", e);
    }
}

testConnection();
