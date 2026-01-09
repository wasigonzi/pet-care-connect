import { test, expect } from '@playwright/test';

test.describe('Regression Prevention Suite', () => {
  
  test('should prevent login redirect loops', async ({ page }) => {
    let redirectCount = 0;
    const visitedUrls = new Set<string>();
    
    page.on('response', (response) => {
      if ([301, 302, 303, 307, 308].includes(response.status())) {
        redirectCount++;
        visitedUrls.add(response.url());
      }
    });

    // Visit login page
    await page.goto('http://localhost:3000/login', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });

    // Should not have excessive redirects
    expect(redirectCount).toBeLessThan(5);
    
    // Should successfully reach login page
    await expect(page.locator('form')).toBeVisible();
    
    // Should not visit the same URL multiple times (loop detection)
    const uniqueUrls = Array.from(visitedUrls);
    const totalVisits = redirectCount;
    expect(uniqueUrls.length).toBeGreaterThanOrEqual(totalVisits * 0.8); // Allow some repeated visits but not loops
    
    console.log(`✅ No redirect loops detected (${redirectCount} redirects to ${uniqueUrls.length} unique URLs)`);
  });

  test('should ensure all client portal navigation links work', async ({ page }) => {
    // Login as admin (will be redirected but we can test client routes)
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Test all client routes that should now exist
    const clientRoutes = [
      '/client',
      '/client/pets', 
      '/client/appointments',
      '/client/billing',
      '/client/communications',
      '/client/settings'
    ];

    const results: Array<{route: string, status: 'ok' | 'error', message?: string}> = [];

    for (const route of clientRoutes) {
      try {
        await page.goto(`http://localhost:3000${route}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });

        // Check if we get a 404 or error page
        const notFoundIndicators = [
          'This page could not be found',
          '404',
          'Page not found',
          'Not Found'
        ];

        let hasError = false;
        for (const indicator of notFoundIndicators) {
          const errorElement = page.locator(`text=${indicator}`);
          if (await errorElement.isVisible()) {
            hasError = true;
            break;
          }
        }

        if (hasError) {
          results.push({
            route,
            status: 'error',
            message: '404 or error page detected'
          });
        } else {
          results.push({
            route,
            status: 'ok'
          });
        }

      } catch (error) {
        results.push({
          route,
          status: 'error',
          message: `Navigation error: ${error}`
        });
      }
    }

    // Log results
    console.log('\n=== CLIENT PORTAL NAVIGATION TEST ===');
    results.forEach(result => {
      if (result.status === 'ok') {
        console.log(`✅ ${result.route} - OK`);
      } else {
        console.log(`❌ ${result.route} - ${result.message}`);
      }
    });

    // All routes should be accessible (no 404s)
    const errorCount = results.filter(r => r.status === 'error').length;
    expect(errorCount).toBe(0);
  });

  test('should verify authentication flow works end-to-end', async ({ page }) => {
    // 1. Start at protected route - should redirect to login
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
    console.log('✅ Protected route redirects to login');

    // 2. Login with valid credentials
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // 3. Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    console.log('✅ Login redirects to dashboard');

    // 4. Should show user info
    await expect(page.locator('main')).toBeVisible();
    console.log('✅ Dashboard loads successfully');

    // 5. Test logout
    const logoutButton = page.locator('form[action*="signout"] button, button:has-text("Salir")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect back to login
      await expect(page).toHaveURL(/.*\/login/);
      console.log('✅ Logout redirects to login');

      // 6. Try to access protected route again - should redirect to login
      await page.goto('http://localhost:3000/dashboard');
      await expect(page).toHaveURL(/.*\/login/);
      console.log('✅ Session cleared - protected route redirects to login');
    } else {
      console.log('⚠️ Logout button not found - may need manual testing');
    }
  });

  test('should verify no infinite recursion in database queries', async ({ page }) => {
    const consoleLogs: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('infinite recursion')) {
        consoleLogs.push(msg.text());
      }
    });

    // Login and navigate to different pages
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Visit several pages that query the database
    const pagesToTest = [
      '/dashboard',
      '/dashboard/clients',
      '/dashboard/patients',
      '/dashboard/appointments'
    ];

    for (const pageUrl of pagesToTest) {
      await page.goto(`http://localhost:3000${pageUrl}`);
      await page.waitForTimeout(2000); // Wait for any async operations
    }

    // Check for infinite recursion errors
    if (consoleLogs.length > 0) {
      console.log('❌ Infinite recursion errors found:');
      consoleLogs.forEach(log => console.log(`  - ${log}`));
    } else {
      console.log('✅ No infinite recursion errors detected');
    }

    expect(consoleLogs.length).toBe(0);
  });

  test('should verify all dashboard routes are accessible', async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Test critical dashboard routes
    const criticalRoutes = [
      '/dashboard',
      '/dashboard/clients',
      '/dashboard/patients', 
      '/dashboard/appointments',
      '/dashboard/billing'
    ];

    let accessibleRoutes = 0;

    for (const route of criticalRoutes) {
      try {
        await page.goto(`http://localhost:3000${route}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });

        // Check if page loads successfully
        if (page.url().includes(route)) {
          const mainContent = page.locator('main, [role="main"]');
          if (await mainContent.isVisible()) {
            accessibleRoutes++;
            console.log(`✅ ${route} - Accessible`);
          } else {
            console.log(`⚠️ ${route} - No main content`);
          }
        } else {
          console.log(`❌ ${route} - Redirected to ${page.url()}`);
        }
      } catch (error) {
        console.log(`❌ ${route} - Error: ${error}`);
      }
    }

    console.log(`📊 Dashboard accessibility: ${accessibleRoutes}/${criticalRoutes.length} routes`);
    
    // Expect at least 80% of critical routes to be accessible
    expect(accessibleRoutes / criticalRoutes.length).toBeGreaterThan(0.8);
  });

  test('should verify session persistence across page refreshes', async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    console.log('✅ Initial login successful');

    // Refresh the page
    await page.reload();
    await page.waitForTimeout(2000);

    // Should still be on dashboard (session persisted)
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('main')).toBeVisible();
    console.log('✅ Session persisted after page refresh');

    // Navigate to another protected route
    await page.goto('http://localhost:3000/dashboard/clients');
    await page.waitForTimeout(2000);

    // Should be able to access it without re-login
    expect(page.url()).toContain('/dashboard/clients');
    console.log('✅ Can navigate to other protected routes');
  });
});