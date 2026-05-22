import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('hero section renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('.hero-grid');
    await expect(hero).toBeVisible();
    await expect(page.locator('.hero-left .display')).toHaveText('Engineer');
    await expect(page.locator('.kicker.rotator .word')).toBeVisible();

    await page.screenshot({ path: 'test-results/homepage-hero.png', fullPage: false });
  });

  test('hero right sidebar has current and past sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const aside = page.locator('.hero-right');
    await expect(aside).toBeVisible();
    await expect(aside.locator('h3')).toHaveText('Based in Berlin');
    await expect(aside.locator('.timeline-label').first()).toHaveText('Current');
    await expect(aside.locator('.timeline-label').nth(1)).toHaveText('Past');

    await aside.screenshot({ path: 'test-results/homepage-sidebar.png' });
  });

  test('no divider line between hero and selected work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hrElements = page.locator('.hero-rule, header + hr');
    await expect(hrElements).toHaveCount(0);

    const heroBottom = page.locator('.hero-grid');
    const selectedWork = page.locator('.selected-work');
    const gap = page.locator('.hero-grid ~ hr');
    await expect(gap).toHaveCount(0);

    await page.screenshot({
      path: 'test-results/homepage-hero-to-work-transition.png',
      clip: {
        x: 0,
        y: (await heroBottom.boundingBox())!.y + (await heroBottom.boundingBox())!.height - 40,
        width: 1280,
        height: 200,
      },
    });
  });

  test('selected work section renders projects', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const section = page.locator('.selected-work');
    await expect(section).toBeVisible();
    await expect(section.locator('h2')).toHaveText('Selected Work');

    const cards = page.locator('.proj-grid .proj-card');
    await expect(cards).toHaveCount(3);

    await section.screenshot({ path: 'test-results/homepage-selected-work.png' });
  });

  test('CTA line includes Project Hub link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ctaLine = page.locator('.cta-line');
    await expect(ctaLine).toBeVisible();
    await expect(ctaLine.locator('a[href="/hub"]')).toHaveText('Project Hub');

    await ctaLine.screenshot({ path: 'test-results/homepage-cta.png' });
  });

  test('accent switcher works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const tweaks = page.locator('.tweaks');
    await expect(tweaks).toBeVisible();

    await tweaks.locator('.swatch[data-id="terracotta"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'terracotta');

    await tweaks.screenshot({ path: 'test-results/homepage-accent-switcher.png' });
  });

  test('full page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/homepage-full.png', fullPage: true });
  });
});
