#!/usr/bin/env node

/**
 * Fix remaining pages that still have dynamic rendering issues
 */

const fs = require('fs');
const path = require('path');

const problematicPages = [
    'app/dashboard/permissions/page.tsx',
    'app/dashboard/suppliers/new/page.tsx',
    'app/dashboard/tasks/new/page.tsx',
    'app/dashboard/vaccinations/new/page.tsx',
    'app/dashboard/records/new/page.tsx',
    'app/dashboard/inventory/new/page.tsx',
    'app/auth/register/page.tsx',
    'app/dashboard/billing/new/page.tsx',
    'app/login/page.tsx',
    'app/dashboard/appointments/new/page.tsx',
    'app/(client)/client/pets/new/page.tsx',
    'app/dashboard/estimates/new/page.tsx',
    'app/dashboard/clients/new/page.tsx',
    'app/dashboard/boarding/new/page.tsx',
    'app/dashboard/communications/new/page.tsx',
    'app/not-found.tsx'
];

function addDynamicExport(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️  File not found: ${filePath}`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has dynamic export
    if (content.includes('export const dynamic')) {
        console.log(`   ✅ Already has dynamic export: ${filePath}`);
        return true;
    }
    
    // Find the first import statement or export statement
    const importMatch = content.match(/^(import .+$|"use client";?$)/m);
    if (importMatch) {
        const insertIndex = content.indexOf(importMatch[0]) + importMatch[0].length;
        const dynamicExport = '\n\n// Force dynamic rendering\nexport const dynamic = \'force-dynamic\';';
        content = content.slice(0, insertIndex) + dynamicExport + content.slice(insertIndex);
    } else {
        // If no imports, add at the beginning
        content = '// Force dynamic rendering\nexport const dynamic = \'force-dynamic\';\n\n' + content;
    }
    
    fs.writeFileSync(filePath, content);
    return true;
}

function main() {
    console.log('🔧 Fixing remaining problematic pages...\n');
    
    let fixedCount = 0;
    let notFoundCount = 0;
    
    for (const filePath of problematicPages) {
        if (addDynamicExport(filePath)) {
            if (fs.existsSync(filePath)) {
                console.log(`✅ Fixed: ${filePath}`);
                fixedCount++;
            }
        } else {
            notFoundCount++;
        }
    }
    
    // Also create not-found.tsx if it doesn't exist
    const notFoundPath = 'app/not-found.tsx';
    if (!fs.existsSync(notFoundPath)) {
        const notFoundContent = `// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-8">Página no encontrada</p>
            <a href="/" className="text-blue-600 hover:underline">
                Volver al inicio
            </a>
        </div>
    );
}`;
        
        fs.writeFileSync(notFoundPath, notFoundContent);
        console.log(`✅ Created: ${notFoundPath}`);
        fixedCount++;
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Pages fixed: ${fixedCount}`);
    console.log(`   Pages not found: ${notFoundCount}`);
    
    console.log('\n✅ All remaining pages should now have proper dynamic rendering.');
    console.log('🔧 Try running "npm run build" again to verify.');
}

main();