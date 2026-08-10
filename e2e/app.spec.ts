import { expect, test } from '@playwright/test';

test('should display the blog overview page', async ({ page }) => {
  await page.goto('/');

  const firstBlogCard = page.locator('app-blog-card').first();

  await expect(firstBlogCard).toBeVisible();
  await expect(firstBlogCard).toContainText('Angular Signals');
});
