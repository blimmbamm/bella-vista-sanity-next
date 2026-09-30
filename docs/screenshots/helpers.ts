import type { Locator, Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const OUT_DIR = fileURLToPath(new URL('../src/assets/screenshots/', import.meta.url));

/** Saves a screenshot under the name used by the <Screenshot> component in the docs. */
export async function shoot(target: Page | Locator, name: string) {
	await target.screenshot({ path: `${OUT_DIR}${name}.png`, animations: 'disabled' });
}

/** Draws a red frame around an element to point readers at it. Use `inset` at the viewport edge. */
export async function highlight(locator: Locator, { inset = false } = {}) {
	await locator.evaluate((element, inset) => {
		element.style.outline = '3px solid #e5484d';
		element.style.outlineOffset = inset ? '-3px' : '2px';
		element.style.borderRadius = '4px';
	}, inset);
}

/** Lets fonts, images and transitions settle before a screenshot. */
export async function settle(page: Page, ms = 800) {
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(ms);
}
