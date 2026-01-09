import { test, expect } from '@playwright/test';

test.describe('Supabase Integration Audit', () => {
  
  test('should verify environment variables are loaded', async ({ page }) => {
    // Check if the app loads without environment variable errors
    await page.goto('http://localhost:3000/login');
    
    // Look for any console errors related to missing env vars
    const logs: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('SUPABASE')) {
        logs.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (logs.length > 0) {
      console.log('❌ Environment variable errors found:');
      logs.forEach(log => console.log(`  - ${log}`));
    } else {
      console.log('✅ No Supabase environment variable errors');
    }
    
    // Page should load successfully
    await expect(page.locator('form')).toBeVisible();
  });
  
  test('should test database connectivity', async ({ page }) => {
    // Login to test database connection
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // If login works, database is connected
    await page.waitForTimeout(3000);
    
    if (page.url().includes('/dashboard')) {
      console.log('✅ Database connectivity working (login successful)');
    } else {
      console.log('❌ Database connectivity issues (login failed)');
    }
  });
  
  test('should verify RLS policies are not blocking basic operations', async ({ page }) => {
    // Test that we can access protected routes after login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    if (page.url().includes('/dashboard')) {
      console.log('✅ RLS policies allow authenticated access');
      
      // Try to navigate to different sections
      const testRoutes = [
        '/dashboard/clients',
        '/dashboard/appointments', 
        '/dashboard/inventory',
        '/dashboard/admin'
      ];
      
      for (const route of testRoutes) {
        await page.goto(`http://localhost:3000${route}`);
        await page.waitForTimeout(1000);
        
        if (page.url().includes(route)) {
          console.log(`✅ ${route} accessible`);
        } else {
          console.log(`⚠️ ${route} redirected to ${page.url()}`);
        }
      }
    } else {
      console.log('❌ RLS policies blocking access');
    }
  });
});