import { test, expect } from '@playwright/test';

test('should display the blog page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('mat-toolbar')).toContainText('Blog');
  await expect(page.locator('mat-toolbar')).toContainText('Übersicht');
  await expect(page.locator('mat-toolbar')).toContainText('About');
});
