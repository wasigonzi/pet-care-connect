import { test, expect } from '@playwright/test';

test.describe('Menu Audit Smoke Test', () => {
    // Assuming we can bypass auth or we are already logged in via global setup
    // For this smoke test, we'll assume a valid session or mock it if possible in a real env
    // Here we just define the routes to check.

    const routes = [
        '/dashboard',
        '/dashboard/clients',
        '/dashboard/patients',
        '/dashboard/appointments',
        '/dashboard/records',
        '/dashboard/vaccinations',
        '/dashboard/templates',
        '/dashboard/wellness-plans',
        '/dashboard/boarding',
        '/dashboard/billing',
        '/dashboard/estimates',
        '/dashboard/inventory',
        '/dashboard/suppliers',
        '/dashboard/reports',
        '/dashboard/communications',
        '/dashboard/reminders',
        '/dashboard/tasks',
        '/dashboard/staff',
        '/dashboard/permissions',
        '/dashboard/settings',
        '/dashboard/time-tracking',
        '/dashboard/audit'
    ];

    for (const route of routes) {
        test(`should load ${route} without placeholder`, async ({ page }) => {
            // Navigate to route
            await page.goto(route);

            // If redirected to login, this test will fail to find dashboard content, 
            // but if we are authenticated:

            // Check for 404
            const notFound = await page.getByText('404').isVisible();
            expect(notFound).toBeFalsy();

            const pageNotFound = await page.getByText('Page Not Found').isVisible();
            expect(pageNotFound).toBeFalsy();

            // Check for placeholder text
            const comingSoon = await page.getByText('Coming Soon').isVisible();
            expect(comingSoon).toBeFalsy();

            const underDev = await page.getByText('under development').isVisible();
            expect(underDev).toBeFalsy();

            // Check for basic functionality markers (table or header)
            // Most pages have a header H2
            await expect(page.locator('h2')).toBeVisible();
        });
    }
});
