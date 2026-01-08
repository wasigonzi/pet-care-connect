import { test, expect } from '@playwright/test';

test.describe('Landing CMS', () => {
    // Note: These tests assume the user is logged in or we can bypass validation for local testing.
    // Since we can't easily mock Supabase Auth in this environment without complex setup, 
    // we will test the existence of the critical paths and the fallback behavior of the public page.

    test('Public page renders with default content', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/GestionVet/);

        // Check for default text
        await expect(page.getByText('Cuidado Veterinario de')).toBeVisible();
        await expect(page.getByText('Excelencia y Corazón')).toBeVisible();
    });

    // This test would require authentication to pass
    test.skip('Admin can access CMS', async ({ page }) => {
        await page.goto('/dashboard/admin/landing');
        await expect(page.getByText('Gestión de Contenido Web')).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Hero' })).toBeVisible();
    });
});
