import { expect, test } from '@playwright/test';

test('German home page loads', async ({ page }) => {
	await page.goto('/de');
	await expect(page.locator('h1')).toBeVisible();
	await expect(page).toHaveURL(/\/de\/?$/);
});

test('English home page loads', async ({ page }) => {
	await page.goto('/en');
	await expect(page.locator('h1')).toBeVisible();
	await expect(page).toHaveURL(/\/en\/?$/);
});

test('language switch from DE to EN', async ({ page }) => {
	await page.goto('/de');
	await page.getByRole('button', { name: 'Menü öffnen' }).click();
	await page.locator('a[hreflang="en"]').click();
	await expect(page).toHaveURL(/\/en/);
	await expect(page.locator('h1')).toBeVisible();
});

test('navigation drawer opens', async ({ page }) => {
	await page.goto('/de');
	await page.getByRole('button', { name: 'Menü öffnen' }).click();
	await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Menü schließen' })).toBeVisible();
});
