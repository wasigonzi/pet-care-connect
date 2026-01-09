import { test, expect } from '@playwright/test';

test.describe('Login Redirect Loop Debug', () => {
  test('should capture redirect chain and identify loop', async ({ page }) => {
    const redirects: string[] = [];
    const requests: Array<{ url: string, status: number, method: string }> = [];
    
    // Track all navigation events
    page.on('response', (response) => {
      requests.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method()
      });
      
      // Track redirects
      if ([301, 302, 303, 307, 308].includes(response.status())) {
        redirects.push(`${response.status()}: ${response.url()}`);
      }
    });

    // Track page navigation
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) {
        console.log(`NAVIGATED TO: ${frame.url()}`);
      }
    });

    console.log('=== STARTING LOGIN PAGE TEST ===');
    
    try {
      // Visit login page with timeout
      await page.goto('http://localhost:3000/login', { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      console.log(`FINAL URL: ${page.url()}`);
      
      // Check if we're stuck in a loop (same URL visited multiple times)
      const urlCounts = requests.reduce((acc, req) => {
        acc[req.url] = (acc[req.url] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('=== URL VISIT COUNTS ===');
      Object.entries(urlCounts).forEach(([url, count]) => {
        if (count > 2) {
          console.log(`🔄 LOOP DETECTED: ${url} visited ${count} times`);
        } else {
          console.log(`✓ ${url}: ${count} visits`);
        }
      });
      
      console.log('=== REDIRECT CHAIN ===');
      redirects.forEach((redirect, i) => {
        console.log(`${i + 1}. ${redirect}`);
      });
      
      console.log('=== ALL REQUESTS ===');
      requests.forEach((req, i) => {
        console.log(`${i + 1}. ${req.method} ${req.status} ${req.url}`);
      });
      
      // Take screenshot for visual debugging
      await page.screenshot({ path: 'login-redirect-debug.png', fullPage: true });
      
      // Check if login form is visible (indicates we reached login page successfully)
      const loginForm = page.locator('form');
      const isLoginFormVisible = await loginForm.isVisible();
      
      console.log(`LOGIN FORM VISIBLE: ${isLoginFormVisible}`);
      
      if (isLoginFormVisible) {
        console.log('✅ Successfully reached login page');
        
        // Check for any console errors
        const logs: string[] = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            logs.push(`CONSOLE ERROR: ${msg.text()}`);
          }
        });
        
        if (logs.length > 0) {
          console.log('=== CONSOLE ERRORS ===');
          logs.forEach(log => console.log(log));
        }
        
      } else {
        console.log('❌ Failed to reach login page - possible redirect loop');
        
        // Check what page we ended up on
        const title = await page.title();
        const currentUrl = page.url();
        console.log(`CURRENT PAGE: ${title} (${currentUrl})`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error}`);
      
      // Still take screenshot to see what happened
      await page.screenshot({ path: 'login-error-debug.png', fullPage: true });
    }
  });
  
  test('should test middleware behavior directly', async ({ page }) => {
    console.log('=== TESTING MIDDLEWARE BEHAVIOR ===');
    
    // Test different routes to see middleware behavior
    const testRoutes = [
      '/login',
      '/dashboard',
      '/client',
      '/',
    ];
    
    for (const route of testRoutes) {
      console.log(`\n--- Testing route: ${route} ---`);
      
      try {
        const response = await page.goto(`http://localhost:3000${route}`, {
          waitUntil: 'networkidle',
          timeout: 5000
        });
        
        console.log(`Status: ${response?.status()}`);
        console.log(`Final URL: ${page.url()}`);
        
        // Check if we got redirected
        if (page.url() !== `http://localhost:3000${route}`) {
          console.log(`🔄 REDIRECTED from ${route} to ${page.url()}`);
        } else {
          console.log(`✓ Stayed on ${route}`);
        }
        
      } catch (error) {
        console.log(`❌ Error accessing ${route}: ${error}`);
      }
    }
  });
});