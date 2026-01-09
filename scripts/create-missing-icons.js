#!/usr/bin/env node

/**
 * Create missing icons to fix 404 errors
 */

const fs = require('fs');
const path = require('path');

// Create a simple PNG icon (base64 encoded 1x1 transparent pixel for now)
const transparentPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';

// Create apple-touch-icon.png (180x180 for iOS)
const appleIcon = Buffer.from(transparentPixel, 'base64');

// Create favicon.ico (simple 16x16)
const favicon = Buffer.from(transparentPixel, 'base64');

console.log('🎨 Creating missing icons...');

try {
    // Create apple-touch-icon.png
    fs.writeFileSync('public/apple-touch-icon.png', appleIcon);
    console.log('✅ Created apple-touch-icon.png');
    
    // Create favicon.ico
    fs.writeFileSync('public/favicon.ico', favicon);
    console.log('✅ Created favicon.ico');
    
    // Create icon-192.png for manifest
    fs.writeFileSync('public/icon-192.png', appleIcon);
    console.log('✅ Created icon-192.png');
    
    // Create icon-512.png for manifest
    fs.writeFileSync('public/icon-512.png', appleIcon);
    console.log('✅ Created icon-512.png');
    
    console.log('\n🎉 All icons created successfully!');
    console.log('📝 Note: These are placeholder icons. Replace with professional veterinary clinic icons later.');
    
} catch (error) {
    console.error('❌ Error creating icons:', error.message);
}