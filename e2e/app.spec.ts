import { test, expect } from '@playwright/test';

test('should display the welcome page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('mat-toolbar')).toContainText('HFTM Web Applications');
  await expect(page.locator('h1')).toContainText('Willkommen zum Angular-Projekttemplate');
});
