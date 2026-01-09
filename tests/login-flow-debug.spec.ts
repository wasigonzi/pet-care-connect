import { test, expect } from '@playwright/test';

test.describe('Login Flow Debug', () => {
  test('should test complete login flow with admin credentials', async ({ page }) => {
    const redirects: string[] = [];
    const requests: Array<{ url: string, status: number, method: string }> = [];
    const consoleLogs: string[] = [];
    
    // Track all requests and responses
    page.on('response', (response) => {
      requests.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method()
      });
      
      if ([301, 302, 303, 307, 308].includes(response.status())) {
        redirects.push(`${response.status()}: ${response.url()}`);
      }
    });

    // Track console logs
    page.on('console', msg => {
      consoleLogs.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    console.log('=== TESTING LOGIN FLOW ===');
    
    // 1. Go to login page
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    console.log(`✓ Reached login page: ${page.url()}`);
    
    // 2. Fill in credentials
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    console.log('✓ Filled credentials');
    
    // 3. Submit form and track what happens
    console.log('--- Submitting login form ---');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    
    // Click submit and wait for navigation or error
    const navigationPromise = page.waitForURL('**', { timeout: 10000 }).catch(() => null);
    await submitButton.click();
    
    // Wait a bit to see what happens
    await page.waitForTimeout(2000);
    
    console.log(`Current URL after submit: ${page.url()}`);
    
    // Check if we got redirected
    if (page.url().includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard');
      
      // Check if dashboard content loads
      const dashboardContent = page.locator('main');
      await expect(dashboardContent).toBeVisible();
      console.log('✅ Dashboard content is visible');
      
    } else if (page.url().includes('/login')) {
      console.log('⚠️ Still on login page - checking for errors');
      
      // Look for error messages
      const errorToast = page.locator('[data-sonner-toast]');
      if (await errorToast.isVisible()) {
        const errorText = await errorToast.textContent();
        console.log(`❌ Error message: ${errorText}`);
      }
      
      // Check if form shows loading state
      const loadingButton = page.locator('button:has-text("Iniciando sesión")');
      if (await loadingButton.isVisible()) {
        console.log('⏳ Form is in loading state');
      }
      
    } else {
      console.log(`🔄 Redirected to unexpected page: ${page.url()}`);
    }
    
    // Log all redirects that occurred
    console.log('=== REDIRECTS DURING LOGIN ===');
    if (redirects.length === 0) {
      console.log('No redirects detected');
    } else {
      redirects.forEach((redirect, i) => {
        console.log(`${i + 1}. ${redirect}`);
      });
    }
    
    // Log relevant requests (POST to login, etc.)
    console.log('=== RELEVANT REQUESTS ===');
    const relevantRequests = requests.filter(req => 
      req.url.includes('/login') || 
      req.url.includes('/dashboard') ||
      req.url.includes('/client') ||
      req.method === 'POST'
    );
    
    relevantRequests.forEach((req, i) => {
      console.log(`${i + 1}. ${req.method} ${req.status} ${req.url}`);
    });
    
    // Log console messages
    console.log('=== CONSOLE LOGS ===');
    if (consoleLogs.length === 0) {
      console.log('No console logs');
    } else {
      consoleLogs.forEach((log, i) => {
        console.log(`${i + 1}. ${log}`);
      });
    }
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'login-flow-debug.png', fullPage: true });
  });
  
  test('should test login with invalid credentials', async ({ page }) => {
    console.log('=== TESTING INVALID CREDENTIALS ===');
    
    await page.goto('http://localhost:3000/login');
    
    // Try invalid credentials
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    console.log(`URL after invalid login: ${page.url()}`);
    
    // Should stay on login page
    expect(page.url()).toContain('/login');
    
    // Look for error message
    const errorToast = page.locator('[data-sonner-toast]');
    if (await errorToast.isVisible()) {
      const errorText = await errorToast.textContent();
      console.log(`✓ Error message shown: ${errorText}`);
    } else {
      console.log('❌ No error message shown');
    }
  });
  
  test('should test if user already exists in database', async ({ page }) => {
    console.log('=== CHECKING USER EXISTENCE ===');
    
    // This test will help us understand if the demo user exists
    await page.goto('http://localhost:3000/login');
    
    // Try to login with demo credentials
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    console.log('=== SERVER LOGS ===');
    consoleLogs.forEach(log => {
      if (log.includes('Starting login') || 
          log.includes('Sign in error') || 
          log.includes('Authenticated successfully') ||
          log.includes('Error fetching profile') ||
          log.includes('Creating new profile')) {
        console.log(log);
      }
    });
    
    console.log(`Final URL: ${page.url()}`);
  });
});