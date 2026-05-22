import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', title: 'swarpi', name: 'home' },
  { path: '/about', title: 'About', name: 'about' },
  { path: '/projects', title: 'Projects', name: 'projects' },
  { path: '/workflow', title: 'Workflow', name: 'workflow' },
  { path: '/writing', title: 'Writing', name: 'writing' },
];

test.describe('Navigation & pages', () => {
  for (const pg of PAGES) {
    test(`${pg.name} page loads without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(pg.path);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      expect(errors).toHaveLength(0);

      await page.screenshot({ path: `test-results/page-${pg.name}.png`, fullPage: true });
    });
  }

  test('grain overlay is present on all pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const grain = page.locator('.grain');
    await expect(grain).toBeVisible();
  });

  test('no duplicate tweaks bars after navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.tweaks')).toHaveCount(1);

    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.tweaks')).toHaveCount(1);
  });
});
