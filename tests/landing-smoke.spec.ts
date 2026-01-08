import { test, expect } from '@playwright/test';

test('Landing page loads successfully', async ({ page }) => {
    const response = await page.goto('/');

    // 1. Assert Status 200 (No 500)
    expect(response?.status()).toBe(200);

    // 2. Assert Main Content
    await expect(page.locator('header')).toBeVisible();

    // 3. Assert Branding element exists (Image or Icon placeholder)
    const branding = page.locator('header img, header .text-primary');
    await expect(branding.first()).toBeVisible();

    // 4. Assert Footer
    await expect(page.locator('footer')).toBeVisible();

    // 5. Check for no visible error text
    await expect(page.getByText('Internal Server Error')).not.toBeVisible();
    await expect(page.getByText('Application Error')).not.toBeVisible();
});
