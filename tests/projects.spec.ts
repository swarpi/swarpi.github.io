import { test, expect } from '@playwright/test';

test.describe('Projects', () => {
  test('projects index lists all projects', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toBeVisible();
    const rows = page.locator('.proj');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/projects-index.png', fullPage: true });
  });

  test('project detail page renders README as HTML', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const firstLink = page.locator('.proj-card, .proj a').first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      const readme = page.locator('.readme-body');
      if (await readme.isVisible()) {
        const preCodeBlocks = readme.locator('> pre > code');
        const rawMarkdown = await preCodeBlocks.count();
        expect(rawMarkdown).toBe(0);

        await readme.screenshot({ path: 'test-results/project-readme.png' });
      }
    }

    await page.screenshot({ path: 'test-results/project-detail.png', fullPage: true });
  });

  test('project hover effect has no layout shift', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const row = page.locator('.proj').first();
    if (await row.isVisible()) {
      const boxBefore = await row.boundingBox();
      await row.hover();
      await page.waitForTimeout(200);
      const boxAfter = await row.boundingBox();

      expect(boxAfter!.width).toBeCloseTo(boxBefore!.width, 0);
      expect(boxAfter!.height).toBeCloseTo(boxBefore!.height, 0);

      await row.screenshot({ path: 'test-results/project-row-hover.png' });
    }
  });
});
