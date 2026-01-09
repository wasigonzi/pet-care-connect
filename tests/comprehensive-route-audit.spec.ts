import { test, expect } from '@playwright/test';

test.describe('Comprehensive Route & Module Audit', () => {
  
  // Test all dashboard routes (should be 100% functional)
  const dashboardRoutes = [
    { path: '/dashboard', name: 'Dashboard Main' },
    { path: '/dashboard/clients', name: 'Clients Management' },
    { path: '/dashboard/patients', name: 'Patients Management' },
    { path: '/dashboard/appointments', name: 'Appointments Calendar' },
    { path: '/dashboard/records', name: 'Medical Records' },
    { path: '/dashboard/vaccinations', name: 'Vaccination Tracking' },
    { path: '/dashboard/templates', name: 'Clinical Templates' },
    { path: '/dashboard/wellness-plans', name: 'Wellness Plans' },
    { path: '/dashboard/boarding', name: 'Boarding Management' },
    { path: '/dashboard/billing', name: 'Billing & Invoices' },
    { path: '/dashboard/estimates', name: 'Estimates' },
    { path: '/dashboard/inventory', name: 'Inventory Management' },
    { path: '/dashboard/suppliers', name: 'Suppliers' },
    { path: '/dashboard/reports', name: 'Reports & Analytics' },
    { path: '/dashboard/communications', name: 'Communications Log' },
    { path: '/dashboard/reminders', name: 'Reminders System' },
    { path: '/dashboard/tasks', name: 'Task Management' },
    { path: '/dashboard/staff', name: 'Staff Management' },
    { path: '/dashboard/permissions', name: 'Role Permissions' },
    { path: '/dashboard/settings', name: 'Settings' },
    { path: '/dashboard/time-tracking', name: 'Time Tracking' },
    { path: '/dashboard/audit', name: 'Audit Logs' },
    { path: '/dashboard/admin/landing', name: 'Landing CMS' }
  ];

  // Test client portal routes (some missing)
  const clientRoutes = [
    { path: '/client', name: 'Client Dashboard', expected: 'functional' },
    { path: '/client/pets', name: 'My Pets', expected: 'functional' },
    { path: '/client/appointments', name: 'My Appointments', expected: 'functional' },
    { path: '/client/billing', name: 'Billing', expected: 'missing' },
    { path: '/client/communications', name: 'Messages', expected: 'missing' },
    { path: '/client/settings', name: 'Settings', expected: 'missing' }
  ];

  test('should audit all dashboard routes for functionality', async ({ page }) => {
    // Login as admin first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    console.log('✅ Admin logged in successfully');

    const results: Array<{route: string, name: string, status: string, issue?: string}> = [];

    for (const route of dashboardRoutes) {
      console.log(`\n--- Testing ${route.name} (${route.path}) ---`);
      
      try {
        await page.goto(`http://localhost:3000${route.path}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });

        // Check if we stayed on the intended route
        if (page.url().includes(route.path)) {
          // Look for common error indicators
          const errorIndicators = [
            'This module is currently under development',
            'Coming Soon',
            'Under Construction',
            'TODO',
            'Not implemented',
            '404',
            'Page not found'
          ];

          let hasError = false;
          let errorFound = '';

          for (const indicator of errorIndicators) {
            const errorElement = page.locator(`text=${indicator}`);
            if (await errorElement.isVisible()) {
              hasError = true;
              errorFound = indicator;
              break;
            }
          }

          if (hasError) {
            results.push({
              route: route.path,
              name: route.name,
              status: 'placeholder',
              issue: `Contains: "${errorFound}"`
            });
            console.log(`⚠️ PLACEHOLDER: ${route.name} - ${errorFound}`);
          } else {
            // Check if page has actual content (not just empty)
            const mainContent = page.locator('main, [role="main"], .content');
            const hasContent = await mainContent.isVisible();
            
            if (hasContent) {
              results.push({
                route: route.path,
                name: route.name,
                status: 'functional'
              });
              console.log(`✅ FUNCTIONAL: ${route.name}`);
            } else {
              results.push({
                route: route.path,
                name: route.name,
                status: 'empty',
                issue: 'No main content found'
              });
              console.log(`⚠️ EMPTY: ${route.name} - No content`);
            }
          }
        } else {
          results.push({
            route: route.path,
            name: route.name,
            status: 'redirect',
            issue: `Redirected to ${page.url()}`
          });
          console.log(`🔄 REDIRECT: ${route.name} -> ${page.url()}`);
        }

      } catch (error) {
        results.push({
          route: route.path,
          name: route.name,
          status: 'error',
          issue: `Error: ${error}`
        });
        console.log(`❌ ERROR: ${route.name} - ${error}`);
      }
    }

    // Summary
    console.log('\n=== DASHBOARD ROUTES AUDIT SUMMARY ===');
    const functional = results.filter(r => r.status === 'functional').length;
    const total = results.length;
    console.log(`✅ Functional: ${functional}/${total} (${Math.round(functional/total*100)}%)`);
    
    const issues = results.filter(r => r.status !== 'functional');
    if (issues.length > 0) {
      console.log('\n❌ Issues Found:');
      issues.forEach(issue => {
        console.log(`  - ${issue.name}: ${issue.status} ${issue.issue || ''}`);
      });
    }

    // Expect at least 80% of routes to be functional
    expect(functional / total).toBeGreaterThan(0.8);
  });

  test('should audit client portal routes and identify missing pages', async ({ page }) => {
    // Create a client user or use existing
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'client@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // If client doesn't exist, try to register
    await page.waitForTimeout(2000);
    if (page.url().includes('/login')) {
      console.log('Client user does not exist, testing with admin (will redirect to dashboard)');
      await page.fill('input[name="email"]', 'admin@petcare.com');
      await page.fill('input[name="password"]', 'password');
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/.*\/dashboard/);
      
      // Navigate to client routes manually to test them
      console.log('Testing client routes as admin (should show 404 or redirect)');
    } else {
      await expect(page).toHaveURL(/.*\/client/);
      console.log('✅ Client logged in successfully');
    }

    const results: Array<{route: string, name: string, status: string, issue?: string}> = [];

    for (const route of clientRoutes) {
      console.log(`\n--- Testing ${route.name} (${route.path}) ---`);
      
      try {
        await page.goto(`http://localhost:3000${route.path}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });

        if (route.expected === 'missing') {
          // These routes should return 404 or redirect
          if (page.url().includes('404') || !page.url().includes(route.path)) {
            results.push({
              route: route.path,
              name: route.name,
              status: 'missing_confirmed',
              issue: 'Route not implemented (expected)'
            });
            console.log(`❌ MISSING (Expected): ${route.name}`);
          } else {
            results.push({
              route: route.path,
              name: route.name,
              status: 'unexpected_found',
              issue: 'Route exists but was expected to be missing'
            });
            console.log(`⚠️ UNEXPECTED: ${route.name} exists but was expected missing`);
          }
        } else {
          // These routes should be functional
          if (page.url().includes(route.path)) {
            const mainContent = page.locator('main, [role="main"], .content');
            const hasContent = await mainContent.isVisible();
            
            if (hasContent) {
              results.push({
                route: route.path,
                name: route.name,
                status: 'functional'
              });
              console.log(`✅ FUNCTIONAL: ${route.name}`);
            } else {
              results.push({
                route: route.path,
                name: route.name,
                status: 'empty'
              });
              console.log(`⚠️ EMPTY: ${route.name}`);
            }
          } else {
            results.push({
              route: route.path,
              name: route.name,
              status: 'redirect',
              issue: `Redirected to ${page.url()}`
            });
            console.log(`🔄 REDIRECT: ${route.name} -> ${page.url()}`);
          }
        }

      } catch (error) {
        results.push({
          route: route.path,
          name: route.name,
          status: 'error',
          issue: `Error: ${error}`
        });
        console.log(`❌ ERROR: ${route.name} - ${error}`);
      }
    }

    // Summary
    console.log('\n=== CLIENT PORTAL AUDIT SUMMARY ===');
    const functional = results.filter(r => r.status === 'functional').length;
    const missing = results.filter(r => r.status === 'missing_confirmed').length;
    const total = results.length;
    
    console.log(`✅ Functional: ${functional}/${total}`);
    console.log(`❌ Missing: ${missing}/${total}`);
    console.log(`📊 Implementation: ${Math.round(functional/total*100)}%`);

    // List missing routes that need implementation
    const missingRoutes = results.filter(r => r.status === 'missing_confirmed');
    if (missingRoutes.length > 0) {
      console.log('\n🔧 Routes that need implementation:');
      missingRoutes.forEach(route => {
        console.log(`  - ${route.name} (${route.route})`);
      });
    }
  });

  test('should check for placeholder content in active pages', async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    const placeholderPhrases = [
      'This module is currently under development',
      'Coming Soon',
      'Under Construction', 
      'Work in Progress',
      'TODO',
      'Not implemented yet',
      'Placeholder',
      'Lorem ipsum'
    ];

    const routesToCheck = [
      '/dashboard',
      '/dashboard/clients',
      '/dashboard/patients',
      '/dashboard/appointments',
      '/dashboard/billing'
    ];

    let placeholdersFound = 0;

    for (const route of routesToCheck) {
      await page.goto(`http://localhost:3000${route}`);
      
      for (const phrase of placeholderPhrases) {
        const element = page.locator(`text=${phrase}`);
        if (await element.isVisible()) {
          console.log(`⚠️ PLACEHOLDER FOUND: "${phrase}" in ${route}`);
          placeholdersFound++;
        }
      }
    }

    if (placeholdersFound === 0) {
      console.log('✅ No placeholder content found in active pages');
    } else {
      console.log(`❌ Found ${placeholdersFound} placeholder content instances`);
    }

    // Expect minimal placeholder content
    expect(placeholdersFound).toBeLessThan(3);
  });

  test('should verify database connectivity in key modules', async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'admin@petcare.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    const modulesToTest = [
      { route: '/dashboard', dataIndicator: 'Ingresos Totales' },
      { route: '/dashboard/clients', dataIndicator: 'table, .client-list' },
      { route: '/dashboard/patients', dataIndicator: 'table, .patient-list' },
      { route: '/dashboard/appointments', dataIndicator: '.calendar, .appointment' },
      { route: '/dashboard/billing', dataIndicator: 'table, .invoice' }
    ];

    let connectedModules = 0;

    for (const module of modulesToTest) {
      console.log(`Testing database connectivity: ${module.route}`);
      
      await page.goto(`http://localhost:3000${module.route}`);
      await page.waitForTimeout(2000);

      // Look for data indicators (tables, lists, metrics)
      const dataElement = page.locator(module.dataIndicator);
      const hasData = await dataElement.isVisible();

      if (hasData) {
        console.log(`✅ ${module.route} - Database connected (data visible)`);
        connectedModules++;
      } else {
        console.log(`⚠️ ${module.route} - No data visible (may be empty or disconnected)`);
      }
    }

    console.log(`\n📊 Database Connectivity: ${connectedModules}/${modulesToTest.length} modules`);
    
    // Expect most modules to show data
    expect(connectedModules / modulesToTest.length).toBeGreaterThan(0.6);
  });
});