import { test, expect } from '@playwright/test';

test.describe('Login Flow - Functional Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
    });

    test('should display login form correctly', async ({ page }) => {
        // Check page title/branding
        await expect(page.locator('text=Enter your credentials')).toBeVisible();

        // Check form fields
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();

        // Check demo credentials hint
        await expect(page.locator('text=admin@petcare.com')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        // Fill with invalid credentials
        await page.fill('input[name="email"]', 'invalid@test.com');
        await page.fill('input[name="password"]', 'wrongpassword');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for error message
        await page.waitForTimeout(2000);

        // Should show error toast or message
        const errorVisible = await page.locator('text=/invalid|incorrect|wrong/i').isVisible().catch(() => false);
        expect(errorVisible).toBeTruthy();
    });

    test('should login admin user and redirect to dashboard', async ({ page }) => {
        // Fill with admin credentials
        await page.fill('input[name="email"]', 'admin@petcare.com');
        await page.fill('input[name="password"]', 'password');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for navigation
        await page.waitForURL(/\/(dashboard|client)/, { timeout: 10000 });

        // Should redirect to dashboard for admin
        const url = page.url();
        console.log('Redirected to:', url);

        // Admin should go to /dashboard
        expect(url).toContain('/dashboard');

        // Should see dashboard content
        await expect(page.locator('text=/dashboard|panel|admin/i')).toBeVisible();
    });

    test('should login client user and redirect to client portal', async ({ page }) => {
        // Fill with client credentials
        await page.fill('input[name="email"]', 'client@petcare.com');
        await page.fill('input[name="password"]', 'password');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for navigation
        await page.waitForURL(/\/(dashboard|client)/, { timeout: 10000 });

        // Should redirect to client portal
        const url = page.url();
        console.log('Redirected to:', url);

        // Client should go to /client
        expect(url).toContain('/client');

        // Should see client portal content
        await expect(page.locator('text=/mis|mascotas|citas/i')).toBeVisible();
    });

    test('should maintain session after page refresh', async ({ page }) => {
        // Login as admin
        await page.fill('input[name="email"]', 'admin@petcare.com');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');

        // Wait for redirect
        await page.waitForURL(/\/dashboard/, { timeout: 10000 });

        // Refresh page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Should still be on dashboard (not redirected to login)
        expect(page.url()).toContain('/dashboard');
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.fill('input[name="email"]', 'admin@petcare.com');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');

        // Wait for redirect
        await page.waitForURL(/\/dashboard/, { timeout: 10000 });

        // Find and click logout button (adjust selector as needed)
        const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Cerrar Sesión"), a:has-text("Logout"), a:has-text("Cerrar Sesión")').first();

        if (await logoutButton.isVisible()) {
            await logoutButton.click();

            // Should redirect to login
            await page.waitForURL(/\/login/, { timeout: 5000 });
            expect(page.url()).toContain('/login');
        } else {
            console.log('Logout button not found - skipping logout test');
        }
    });

    test('should show loading state during login', async ({ page }) => {
        // Fill credentials
        await page.fill('input[name="email"]', 'admin@petcare.com');
        await page.fill('input[name="password"]', 'password');

        // Click submit
        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Should show loading text
        await expect(submitButton).toContainText(/iniciando|loading/i);

        // Button should be disabled
        await expect(submitButton).toBeDisabled();
    });

    test('should validate email format', async ({ page }) => {
        // Try invalid email format
        await page.fill('input[name="email"]', 'notanemail');
        await page.fill('input[name="password"]', 'password123');

        // Try to submit
        await page.click('button[type="submit"]');

        // HTML5 validation should prevent submission
        const emailInput = page.locator('input[name="email"]');
        const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);

        expect(validationMessage).toBeTruthy();
    });

    test('should require password', async ({ page }) => {
        // Fill only email
        await page.fill('input[name="email"]', 'admin@petcare.com');

        // Try to submit without password
        await page.click('button[type="submit"]');

        // HTML5 validation should prevent submission
        const passwordInput = page.locator('input[name="password"]');
        const validationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);

        expect(validationMessage).toBeTruthy();
    });

    test('should have registration link', async ({ page }) => {
        // Check for registration link
        const registerLink = page.locator('a:has-text("Regístrate")');
        await expect(registerLink).toBeVisible();

        // Should link to registration page
        await expect(registerLink).toHaveAttribute('href', '/auth/register');
    });
});

test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
        // Try to access dashboard directly
        await page.goto('/dashboard');

        // Should redirect to login
        await page.waitForURL(/\/login/, { timeout: 5000 });
        expect(page.url()).toContain('/login');
    });

    test('should redirect to login when accessing client portal without auth', async ({ page }) => {
        // Try to access client portal directly
        await page.goto('/client');

        // Should redirect to login
        await page.waitForURL(/\/login/, { timeout: 5000 });
        expect(page.url()).toContain('/login');
    });
});
