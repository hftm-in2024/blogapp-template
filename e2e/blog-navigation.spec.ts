import { test, expect } from '@playwright/test';

test('should navigate to blog detail page', async ({ page }) => {
  await page.goto('/');

  // Verifica que existe pelo menos um botão "Blog Detail"
  const detailButton = page.getByRole('button', { name: 'Blog Detail' }).first();

  await expect(detailButton).toBeVisible();

  // Clica no primeiro botão
  await detailButton.click();

  // Verifica que mudou para uma página de detalhe
  await expect(page).toHaveURL(/\/blog\/\d+$/);

  // Verifica que existe um título na página
  await expect(page.locator('h1')).toBeVisible();
});
