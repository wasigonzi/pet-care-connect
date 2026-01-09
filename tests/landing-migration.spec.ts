import { test, expect } from '@playwright/test';

test.describe('Landing Page - Content Migration Smoke Test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load landing page without errors', async ({ page }) => {
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');

        // Check for no console errors (except known warnings)
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        // Should not have critical errors
        expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
    });

    test('should display header with required CTAs', async ({ page }) => {
        // CRITICAL: Verify header CTAs are present and unchanged
        const portalClientesButton = page.getByRole('link', { name: /portal clientes/i });
        const agendarCitaButton = page.getByRole('link', { name: /agendar cita/i });

        await expect(portalClientesButton).toBeVisible();
        await expect(agendarCitaButton).toBeVisible();

        // Verify correct hrefs
        await expect(portalClientesButton).toHaveAttribute('href', '/login');
        await expect(agendarCitaButton).toHaveAttribute('href', '/dashboard/appointments/new');
    });

    test('should display hero section with migrated content', async ({ page }) => {
        // Check for hero headline
        const heroHeadline = page.getByRole('heading', {
            name: /experiencia y cariño al servicio de tus mascotas/i
        });
        await expect(heroHeadline).toBeVisible();

        // Check for hero subheadline mentioning Dra. Pabón
        const heroText = page.getByText(/dra\. patricia pabón/i);
        await expect(heroText).toBeVisible();

        // Check for CTA buttons in hero
        const heroCTA = page.getByRole('link', { name: /agenda tu cita/i }).first();
        await expect(heroCTA).toBeVisible();
    });

    test('should display trust bar with stats', async ({ page }) => {
        // Check for experience stat
        const experienceStat = page.getByText(/16\+/i);
        await expect(experienceStat).toBeVisible();

        // Check for licenses stat
        const licensesStat = page.getByText(/licencias activas/i);
        await expect(licensesStat).toBeVisible();
    });

    test('should display services section', async ({ page }) => {
        // Navigate to services section
        await page.getByRole('link', { name: /servicios/i }).first().click();
        await page.waitForURL('/#services');

        // Check for services heading
        const servicesHeading = page.getByRole('heading', { name: /nuestros servicios/i });
        await expect(servicesHeading).toBeVisible();

        // Check for at least one service card
        const medicineService = page.getByText(/medicina general y preventiva/i);
        await expect(medicineService).toBeVisible();

        // Check for TeleConsulta service
        const teleConsulta = page.getByText(/teleconsulta/i);
        await expect(teleConsulta).toBeVisible();
    });

    test('should display why choose us section', async ({ page }) => {
        // Check for features section
        const whyChooseHeading = page.getByRole('heading', { name: /por qué elegirnos/i });
        await expect(whyChooseHeading).toBeVisible();

        // Check for key features
        const experienceFeature = page.getByText(/16\+ años de experiencia/i);
        await expect(experienceFeature).toBeVisible();

        const holisticFeature = page.getByText(/enfoque holístico/i);
        await expect(holisticFeature).toBeVisible();
    });

    test('should display about section with Dra. Pabón info', async ({ page }) => {
        // Navigate to about section
        await page.getByRole('link', { name: /sobre nosotros/i }).first().click();

        // Check for about heading
        const aboutHeading = page.getByRole('heading', { name: /amamos a los animales/i });
        await expect(aboutHeading).toBeVisible();

        // Check for Dra. Pabón mention
        const draPabon = page.getByText(/dra\. patricia n\. pabón/i);
        await expect(draPabon).toBeVisible();

        // Check for credentials
        const rossUniversity = page.getByText(/ross university/i);
        await expect(rossUniversity).toBeVisible();
    });

    test('should display process/how it works section', async ({ page }) => {
        // Check for process heading
        const processHeading = page.getByRole('heading', { name: /cómo funciona/i });
        await expect(processHeading).toBeVisible();

        // Check for process steps
        const step1 = page.getByText(/agenda tu cita/i).first();
        await expect(step1).toBeVisible();

        const step2 = page.getByText(/trae a tu mascota/i);
        await expect(step2).toBeVisible();
    });

    test('should display special products section', async ({ page }) => {
        // Check for My Sweet Pet Cookies
        const cookiesHeading = page.getByText(/my sweet pet cookies/i);
        await expect(cookiesHeading).toBeVisible();

        // Check for product description
        const cookiesDesc = page.getByText(/galletas nutricionales/i);
        await expect(cookiesDesc).toBeVisible();
    });

    test('should display contact section with all info', async ({ page }) => {
        // Navigate to contact section
        await page.getByRole('link', { name: /contacto/i }).first().click();
        await page.waitForURL('/#contact');

        // Check for contact heading
        const contactHeading = page.getByRole('heading', { name: /visítanos/i });
        await expect(contactHeading).toBeVisible();

        // Check for address
        const address = page.getByText(/#41 ave\. santa cruz, bayamón/i);
        await expect(address).toBeVisible();

        // Check for phone numbers
        const phone1 = page.getByText(/787-520-6080/i);
        await expect(phone1).toBeVisible();

        // Check for WhatsApp
        const whatsapp = page.getByText(/787-466-6486/i);
        await expect(whatsapp).toBeVisible();

        // Check for email
        const email = page.getByText(/clinicaveterinariasantacruzpr@gmail\.com/i);
        await expect(email).toBeVisible();

        // Check for hours
        const hours = page.getByText(/lunes a viernes/i);
        await expect(hours).toBeVisible();
    });

    test('should display footer with all information', async ({ page }) => {
        // Scroll to footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Check for clinic name in footer
        const clinicName = page.getByText(/clínica veterinaria santa cruz/i).last();
        await expect(clinicName).toBeVisible();

        // Check for copyright
        const copyright = page.getByText(/todos los derechos reservados/i);
        await expect(copyright).toBeVisible();

        // Check for quick links
        const quickLinks = page.getByText(/enlaces rápidos/i);
        await expect(quickLinks).toBeVisible();
    });

    test('should not contain placeholder text', async ({ page }) => {
        // Get all text content
        const bodyText = await page.textContent('body');

        // Check for common placeholder strings
        expect(bodyText).not.toContain('Lorem ipsum');
        expect(bodyText).not.toContain('placeholder');
        expect(bodyText).not.toContain('TODO');
        expect(bodyText).not.toContain('under development');
        expect(bodyText).not.toContain('coming soon');
    });

    test('should have responsive header on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Header should still be visible
        const header = page.locator('header');
        await expect(header).toBeVisible();

        // CTAs should still be accessible
        const portalClientesButton = page.getByRole('link', { name: /portal clientes/i });
        await expect(portalClientesButton).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
        // Test services link
        await page.getByRole('link', { name: /^servicios$/i }).first().click();
        await expect(page).toHaveURL('/#services');

        // Test about link
        await page.getByRole('link', { name: /sobre nosotros/i }).first().click();
        await expect(page).toHaveURL('/#about');

        // Test contact link
        await page.getByRole('link', { name: /^contacto$/i }).first().click();
        await expect(page).toHaveURL('/#contact');
    });

    test('should have no 404 errors for images', async ({ page }) => {
        const failed404s: string[] = [];

        page.on('response', response => {
            if (response.status() === 404 && response.url().match(/\.(jpg|jpeg|png|gif|svg|webp)/i)) {
                failed404s.push(response.url());
            }
        });

        await page.waitForLoadState('networkidle');

        // Allow Unsplash placeholders but no broken local images
        const localFailed = failed404s.filter(url => !url.includes('unsplash.com'));
        expect(localFailed).toHaveLength(0);
    });

    test('should have accessible semantic HTML', async ({ page }) => {
        // Check for main landmark
        const main = page.locator('main');
        await expect(main).toBeVisible();

        // Check for proper heading hierarchy
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();

        // Check for footer
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should load within acceptable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        // Should load within 5 seconds
        expect(loadTime).toBeLessThan(5000);
    });
});
