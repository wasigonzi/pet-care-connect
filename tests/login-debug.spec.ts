import { test, expect } from '@playwright/test';

test.describe('Login Debug Test', () => {
    test('should login and redirect based on role', async ({ page }) => {
        // Enable console logging
        page.on('console', msg => console.log('BROWSER:', msg.text()));

        // Enable request/response logging
        page.on('request', request => {
            if (request.url().includes('auth') || request.url().includes('login') || request.url().includes('dashboard')) {
                console.log('REQUEST:', request.method(), request.url());
            }
        });

        page.on('response', async response => {
            if (response.url().includes('auth') || response.url().includes('login') || response.url().includes('dashboard')) {
                console.log('RESPONSE:', response.status(), response.url());
                if (response.status() >= 400) {
                    try {
                        const body = await response.text();
                        console.log('RESPONSE ERROR BODY:', body.substring(0, 500));
                    } catch (e) { }
                }
            }
        });

        // Go to login page
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        // Fill in credentials
        await page.fill('input[name="email"]', 'admin@petcare.com');
        await page.fill('input[type="password"]', 'password');

        // Click login button
        console.log('Clicking login button...');
        await page.click('button[type="submit"]');

        // Wait for navigation
        try {
            await page.waitForURL(/\/(dashboard|client)/, { timeout: 15000 });
            console.log('NAVIGATION SUCCESSFUL TO:', page.url());
        } catch (e) {
            console.log('NAVIGATION TIMED OUT or LOOPED. Current URL:', page.url());
        }

        // Check for errors on page
        const errorMessage = await page.locator('[role="alert"]').textContent().catch(() => null);
        if (errorMessage) {
            console.log('ERROR MESSAGE FOUND ON PAGE:', errorMessage);
        }

        // Check cookies
        const cookies = await page.context().cookies();
        const hasAuthCookie = cookies.some(c => c.name.startsWith('sb-'));
        console.log('HAS AUTH COOKIE:', hasAuthCookie);
        if (hasAuthCookie) {
            console.log('AUTH COOKIES:', cookies.filter(c => c.name.startsWith('sb-')).map(c => c.name));
        }

        // Final screenshot
        await page.screenshot({ path: 'login-loop-debug.png', fullPage: true });
    });
});
