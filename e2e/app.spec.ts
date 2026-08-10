import { expect, test } from '@playwright/test';

test('should display the blog overview page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('app-blog-card').first()).toBeVisible();
  await expect(page.locator('app-blog-card').first()).toContainText('Angular Signals');
});
