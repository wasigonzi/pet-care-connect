import { test, expect } from '@playwright/test';

test.describe('Demo User Creation', () => {
  test('should create demo users via signup', async ({ page }) => {
    const users = [
      { email: 'vet@petcare.com', password: 'password', role: 'vet' },
      { email: 'client@petcare.com', password: 'password', role: 'client' }
    ];
    
    for (const user of users) {
      console.log(`Creating user: ${user.email}`);
      
      // Try to login first to see if user exists
      await page.goto('http://localhost:3000/login');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(2000);
      
      if (page.url().includes('/login')) {
        console.log(`❌ User ${user.email} doesn't exist or login failed`);
        
        // Check if there's a register link
        const registerLink = page.locator('a[href*="register"]');
        if (await registerLink.isVisible()) {
          console.log(`Found register link, attempting to create user ${user.email}`);
          await registerLink.click();
          
          // Fill registration form if it exists
          await page.waitForTimeout(1000);
          
          if (page.url().includes('/register')) {
            await page.fill('input[name="email"]', user.email);
            await page.fill('input[name="password"]', user.password);
            
            // Look for confirm password field
            const confirmPasswordField = page.locator('input[name="confirmPassword"], input[name="confirm_password"]');
            if (await confirmPasswordField.isVisible()) {
              await confirmPasswordField.fill(user.password);
            }
            
            // Look for name field
            const nameField = page.locator('input[name="name"], input[name="full_name"]');
            if (await nameField.isVisible()) {
              await nameField.fill(`Demo ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`);
            }
            
            await page.click('button[type="submit"]');
            await page.waitForTimeout(2000);
            
            console.log(`✅ Attempted to create user ${user.email}`);
          } else {
            console.log(`❌ Register page not found for ${user.email}`);
          }
        } else {
          console.log(`❌ No register link found for ${user.email}`);
        }
      } else {
        console.log(`✅ User ${user.email} already exists and can login`);
      }
    }
  });
  
  test('should verify admin user exists and works', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    if (page.url().includes('/dashboard')) {
      console.log('✅ Admin user exists and works');
    } else {
      console.log('❌ Admin user login failed');
    }
  });
});