import { test, expect } from '@playwright/test';

test.describe('CMS Landing Editor', () => {
    test.beforeEach(async ({ page }) => {
        // Login as admin
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@test.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    });

    test('should save footer content successfully', async ({ page }) => {
        // Navigate to Landing CMS
        await page.goto('/dashboard/admin/landing');

        // Wait for editor to load
        await expect(page.locator('text=Editor de Landing')).toBeVisible();

        // Click on Footer tab
        await page.click('button:has-text("Footer")');

        // Edit copyright text
        const timestamp = Date.now();
        const newCopyright = `© ${timestamp} Test Copyright`;

        await page.fill('input[placeholder*="Copyright"], input:near(:text("Texto Copyright"))', newCopyright);

        // Click save button
        await page.click('button:has-text("Guardar Footer")');

        // Wait for success toast
        await expect(page.locator('text=Sección footer guardada')).toBeVisible({ timeout: 5000 });

        // Reload page
        await page.reload();

        // Verify content persisted
        await page.click('button:has-text("Footer")');
        await expect(page.locator(`input[value="${newCopyright}"]`)).toBeVisible();
    });

    test('should save branding content successfully', async ({ page }) => {
        await page.goto('/dashboard/admin/landing');

        // Click on Marca tab
        await page.click('button:has-text("Marca")');

        // Edit logo text
        const timestamp = Date.now();
        const newLogoText = `TestBrand${timestamp}`;

        await page.fill('input:near(:text("Texto del Logo"))', newLogoText);

        // Click save button
        await page.click('button:has-text("Guardar Marca")');

        // Wait for success toast
        await expect(page.locator('text=Sección branding guardada')).toBeVisible({ timeout: 5000 });

        // Reload and verify
        await page.reload();
        await page.click('button:has-text("Marca")');
        await expect(page.locator(`input[value="${newLogoText}"]`)).toBeVisible();
    });
});
