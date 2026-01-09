#!/usr/bin/env node

/**
 * Create basic icons to avoid 404 errors
 * This creates simple placeholder icons
 */

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" fill="#8b5cf6"/>
  <circle cx="90" cy="70" r="25" fill="white"/>
  <ellipse cx="90" cy="130" rx="40" ry="25" fill="white"/>
  <text x="90" y="160" text-anchor="middle" fill="#8b5cf6" font-family="Arial" font-size="12" font-weight="bold">PetCare</text>
</svg>`;

// Write SVG to public directory
fs.writeFileSync(path.join(process.cwd(), 'public', 'icon.svg'), svgIcon);

// Create a simple HTML file that can be used as favicon
const faviconHtml = `<!DOCTYPE html>
<html>
<head>
<style>
body { margin:0; background:#8b5cf6; display:flex; align-items:center; justify-content:center; height:100vh; }
.icon { width:32px; height:32px; background:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#8b5cf6; font-size:14px; }
</style>
</head>
<body>
<div class="icon">🐾</div>
</body>
</html>`;

console.log('✅ Created basic icons to avoid 404 errors');
console.log('📝 Note: Replace with actual professional icons for production');
console.log('🎨 SVG icon created at: public/icon.svg');

// Create a simple manifest update
const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.icons = [
        {
            "src": "/favicon.ico",
            "sizes": "16x16 32x32",
            "type": "image/x-icon"
        },
        {
            "src": "/icon.svg",
            "sizes": "any",
            "type": "image/svg+xml"
        }
    ];
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Updated manifest.json with available icons');
}