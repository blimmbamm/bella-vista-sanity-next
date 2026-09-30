import { expect, test, type Page } from '@playwright/test';
import { highlight, settle, shoot } from './helpers';

/**
 * Structure paths use the ids from cms/structure.ts. List items without an
 * explicit id get camelCase(title), e.g. "Dishes by category" -> dishesByCategory.
 */
async function openStructure(page: Page, path: string) {
	await page.goto(`/structure/${path}`);
	await page.getByTestId('pane-content').last().waitFor();
	await settle(page);
	await dismissOverlays(page);
}

/** Closes Sanity's announcement card and upgrade notice, which cover parts of the Studio. */
async function dismissOverlays(page: Page) {
	for (const name of ['Got it', 'Dismiss announcements']) {
		const button = page.getByRole('button', { name, exact: true });
		if (await button.isVisible()) {
			await button.click();
		}
	}
	await settle(page, 300);
}

async function openFirstDocument(page: Page) {
	await page.getByTestId('document-list-pane').last().locator('a[href]').first().click();
	await waitForDocument(page);
}

/** The Studio focuses the first field of an opened document, which shows a tooltip. */
async function waitForDocument(page: Page) {
	await page.getByTestId('document-pane').waitFor();
	await settle(page);
	await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
	await settle(page, 300);
}

test('login page', async ({ browser, baseURL }) => {
	const context = await browser.newContext({ baseURL, storageState: undefined });
	const page = await context.newPage();
	await page.goto('/');
	await page.locator('a, button').first().waitFor();
	await settle(page);
	await shoot(page, 'studio-login');
	await context.close();
});

test('overview', async ({ page }) => {
	await openStructure(page, '');
	await shoot(page, 'studio-uebersicht');
});

test('pages', async ({ page }) => {
	await openStructure(page, 'pages;allPages');
	await shoot(page, 'studio-seiten-liste');

	await openStructure(page, 'pages;homepages');
	await openFirstDocument(page);
	await shoot(page, 'studio-seite-bearbeiten');

	await highlight(page.getByTestId('pane-footer'), { inset: true });
	await shoot(page, 'studio-veroeffentlichen');
});

test('add section', async ({ page }) => {
	await openStructure(page, 'pages;homepages');
	await openFirstDocument(page);

	const addButton = page.getByTestId('document-pane').getByRole('button', { name: 'Add item' }).last();
	await addButton.scrollIntoViewIfNeeded();
	await addButton.click();
	await expect(page.getByRole('menu')).toBeVisible();
	await settle(page, 400);
	await shoot(page, 'studio-abschnitt-hinzufuegen');
});

test('translations', async ({ page }) => {
	await openStructure(page, 'pages;homepages');
	await openFirstDocument(page);

	const translations = page.getByRole('button', { name: /translations/i }).first();
	await translations.click();
	await settle(page, 400);
	await shoot(page, 'studio-uebersetzungen');
});

test('menu', async ({ page }) => {
	await openStructure(page, 'menu');
	await shoot(page, 'studio-speisekarte');

	await openStructure(page, 'menu;categories');
	await shoot(page, 'studio-kategorien');

	await openStructure(page, 'menu;dishesByCategory');
	await page.getByTestId('document-list-pane').last().locator('a[href]').first().click();
	await page.getByTestId('document-list-pane').nth(1).waitFor();
	await settle(page);
	await shoot(page, 'studio-gerichte-nach-kategorie');

	await openFirstDocument(page);
	await shoot(page, 'studio-gericht-bearbeiten');
});

test('opening hours', async ({ page }) => {
	await openStructure(page, 'openingHours');
	await waitForDocument(page);
	await shoot(page, 'studio-oeffnungszeiten');
});

test('contact details', async ({ page }) => {
	await openStructure(page, 'siteSettings');
	await waitForDocument(page);
	await shoot(page, 'studio-kontakt');
});

test('navigation', async ({ page }) => {
	await openStructure(page, 'mainNavigation;navigation-de');
	await waitForDocument(page);
	await shoot(page, 'studio-navigation');
});

test('images', async ({ page }) => {
	await openStructure(page, 'singleImage');
	await shoot(page, 'studio-bilder');
});

test('deploy tool', async ({ page }) => {
	await page.goto('/deploy');
	const button = page.getByRole('button', { name: 'Deploy now' });
	await button.waitFor();
	await settle(page);
	await dismissOverlays(page);
	await highlight(button);
	await shoot(page, 'studio-deploy');
});
