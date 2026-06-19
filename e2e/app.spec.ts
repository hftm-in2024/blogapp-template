import { test, expect } from '@playwright/test';

test('should display the blog overview as start page', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('mat-toolbar')).toContainText('HFTM Web Applications');
  await expect(page.locator('h1')).toContainText('Blog-Übersicht');
  await expect(page.locator('app-blog-card').first()).toBeVisible();
});

test('should navigate from a blog card to its detail page', async ({ page }) => {
  await page.goto('/');

  const firstCard = page.locator('app-blog-card').first();
  const title = await firstCard.locator('mat-card-title').innerText();

  await firstCard.getByRole('link', { name: 'Weiterlesen' }).click();

  await expect(page).toHaveURL(/\/blog\/\d+$/);
  await expect(page.locator('mat-card-title')).toContainText(title);
});

test('should navigate to the about page via the header', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Über uns' }).click();

  await expect(page).toHaveURL('/about');
  await expect(page.locator('h1')).toContainText('Über dieses Projekt');
});

test('should show a 404 page for an unknown route', async ({ page }) => {
  await page.goto('/does-not-exist');

  await expect(page.locator('h1')).toContainText('404');
  await page.getByRole('link', { name: 'Zurück zur Übersicht' }).click();
  await expect(page).toHaveURL('/');
});
