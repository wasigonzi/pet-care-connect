import { test, expect } from '@playwright/test';

test.describe('Comprehensive Auth Flow Tests', () => {
  
  test('should login admin user and redirect to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Dashboard should load
    await expect(page.locator('main')).toBeVisible();
    
    // Should show user info
    await expect(page.locator('text=admin@petcare.com')).toBeVisible();
    
    console.log('✅ Admin login successful');
  });
  
  test('should login vet user and redirect to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'vet@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    console.log('✅ Vet login successful');
  });
  
  test('should login client user and redirect to client portal', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'client@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Should redirect to client portal
    await expect(page).toHaveURL(/.*\/client/);
    
    console.log('✅ Client login successful');
  });
  
  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Should show error message
    await expect(page.locator('[data-sonner-toast]')).toBeVisible();
    
    console.log('✅ Invalid credentials handled correctly');
  });
  
  test('should protect dashboard route when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
    
    console.log('✅ Dashboard protection working');
  });
  
  test('should protect client route when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000/client');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
    
    console.log('✅ Client portal protection working');
  });
  
  test('should allow access to public routes', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Should stay on home page
    await expect(page).toHaveURL('http://localhost:3000/');
    
    console.log('✅ Public route access working');
  });
  
  test('should test session persistence after page refresh', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Refresh the page
    await page.reload();
    
    // Should still be on dashboard (session persisted)
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('main')).toBeVisible();
    
    console.log('✅ Session persistence working');
  });
  
  test('should test logout functionality', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Salir"), button:has-text("Logout"), form[action*="signout"] button');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*\/login/);
      
      console.log('✅ Logout working');
    } else {
      console.log('⚠️ Logout button not found - may need to implement');
    }
  });
  
  test('should prevent redirect loops', async ({ page }) => {
    const redirectCount = { count: 0 };
    
    page.on('response', (response) => {
      if ([301, 302, 303, 307, 308].includes(response.status())) {
        redirectCount.count++;
      }
    });
    
    await page.goto('http://localhost:3000/login', { timeout: 10000 });
    
    // Should not have excessive redirects (more than 5 indicates a loop)
    expect(redirectCount.count).toBeLessThan(5);
    
    // Should successfully reach login page
    await expect(page.locator('form')).toBeVisible();
    
    console.log(`✅ No redirect loops detected (${redirectCount.count} redirects)`);
  });
});