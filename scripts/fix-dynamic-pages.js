#!/usr/bin/env node

/**
 * Find and fix pages that need dynamic rendering due to cookie usage
 */

const fs = require('fs');
const path = require('path');

function findPageFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            findPageFiles(fullPath, files);
        } else if (item === 'page.tsx' || item === 'page.ts') {
            files.push(fullPath);
        }
    }
    
    return files;
}

function needsDynamicRendering(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it's an async component that likely uses server actions
    const isAsyncComponent = content.includes('export default async function');
    const usesServerActions = content.includes('await ') && (
        content.includes('createClient') ||
        content.includes('supabase') ||
        content.includes('from "./actions"') ||
        content.includes('from "../actions"')
    );
    
    // Check if it already has dynamic export
    const hasDynamicExport = content.includes('export const dynamic');
    
    return isAsyncComponent && usesServerActions && !hasDynamicExport;
}

function addDynamicExport(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the first import statement
    const importMatch = content.match(/^import .+$/m);
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
    console.log('🔍 Finding pages that need dynamic rendering...\n');
    
    const pageFiles = findPageFiles('app');
    const problematicPages = [];
    const fixedPages = [];
    
    for (const filePath of pageFiles) {
        if (needsDynamicRendering(filePath)) {
            problematicPages.push(filePath);
            
            try {
                addDynamicExport(filePath);
                fixedPages.push(filePath);
                console.log(`✅ Fixed: ${filePath}`);
            } catch (error) {
                console.log(`❌ Failed to fix: ${filePath} - ${error.message}`);
            }
        }
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total pages scanned: ${pageFiles.length}`);
    console.log(`   Pages needing fixes: ${problematicPages.length}`);
    console.log(`   Pages fixed: ${fixedPages.length}`);
    
    if (fixedPages.length > 0) {
        console.log('\n🎉 FIXED PAGES:');
        fixedPages.forEach(page => {
            console.log(`   - ${page}`);
        });
        
        console.log('\n✅ All problematic pages have been fixed with dynamic rendering.');
        console.log('🔧 This should resolve the DYNAMIC_SERVER_USAGE errors.');
    } else {
        console.log('\n✅ No pages needed fixing - all good!');
    }
}

main();