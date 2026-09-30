import { test } from '@playwright/test';
import { AUTH_FILE } from '../playwright.config';

test('log in to the Studio with an API token', async ({ page }) => {
	const token = process.env.SANITY_SCREENSHOT_TOKEN;
	if (!token) {
		throw new Error('SANITY_SCREENSHOT_TOKEN is missing, see docs/.env.example');
	}

	// The Studio picks up "#token=..." from the URL and keeps it in localStorage.
	await page.goto(`/#token=${token}`);
	await page.getByTestId('structure-tool-list-pane').first().waitFor();
	await page.context().storageState({ path: AUTH_FILE });
});
