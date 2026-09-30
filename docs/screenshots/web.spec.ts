import { test, type Page } from '@playwright/test';
import { settle, shoot } from './helpers';

const LANG = 'de';

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		document.addEventListener('DOMContentLoaded', () => {
			const style = document.createElement('style');
			style.textContent = 'nextjs-portal { display: none !important; }';
			document.head.append(style);
		});
	});
});

async function hideStickyHeader(page: Page) {
	await page.addStyleTag({ content: 'header[class*="SiteNav-module"] { visibility: hidden !important; }' });
}

/** Section components are recognised by their CSS module class prefix. */
async function findSection(page: Page, component: string) {
	const selector = `section:has([class*="${component}-module"])`;

	await page.goto(`/${LANG}`);
	if ((await page.locator(selector).count()) > 0) {
		return page.locator(selector).first();
	}

	const hrefs = await page
		.locator(`a[href^="/${LANG}/"]`)
		.evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href')!))]);

	for (const href of hrefs) {
		await page.goto(href);
		if ((await page.locator(selector).count()) > 0) {
			return page.locator(selector).first();
		}
	}

	throw new Error(`No page with a ${component} found`);
}

test('home page', async ({ page }) => {
	await page.goto(`/${LANG}`);
	await settle(page);
	await shoot(page, 'web-startseite');
});

for (const [component, name] of [
	['MenuSection', 'web-speisekarte'],
	['OpeningHoursSection', 'web-oeffnungszeiten'],
	['ContactSection', 'web-kontakt'],
] as const) {
	test(name, async ({ page }) => {
		const section = await findSection(page, component);
		await hideStickyHeader(page);
		await section.scrollIntoViewIfNeeded();
		await settle(page);
		await shoot(section, name);
	});
}

test('navigation', async ({ page }) => {
	await page.goto(`/${LANG}`);
	await page.locator('header button[aria-controls]').click();
	await settle(page);
	await shoot(page, 'web-navigation');
});
