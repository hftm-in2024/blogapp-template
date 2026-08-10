import { expect, test } from '@playwright/test';

test('should display the blog overview page', async ({ page }) => {
  await page.goto('/');

  const blogCards = page.locator('app-blog-card');

  await expect(blogCards.first()).toBeVisible();
  await expect(blogCards).not.toHaveCount(0);
});
