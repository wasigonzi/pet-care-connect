import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Pet Care Connect/);
});

test('login link navigation', async ({ page }) => {
    await page.goto('/');

    // One of the links is "Dashboard ->" with subtext. We can match by partial text or href.
    // Using verify robust selector
    await page.click('a[href="/dashboard"]');

    // Expects page to have a URL containing login since we are not auth'd
    await expect(page).toHaveURL(/.*login/);

    // Verify we see the email input
    await expect(page.getByLabel('Email')).toBeVisible();
});
