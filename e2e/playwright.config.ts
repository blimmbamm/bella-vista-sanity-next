import { defineConfig, devices } from '@playwright/test';

const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000';
const isCI = !!process.env.CI;

/** Public env for the Next.js production build started by webServer. */
const webEnv = {
	...process.env,
	NEXT_PUBLIC_SANITY_PROJECT_ID:
		process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'gcuffsea',
	NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'development',
	NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? WEB_URL,
	NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Trattoria Bella Vista',
};

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 1 : 0,
	reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
	timeout: 60_000,
	use: {
		baseURL: WEB_URL,
		locale: 'de-DE',
		trace: 'on-first-retry',
		...devices['Desktop Chrome'],
	},
	webServer: {
		command: 'npm run build && npm run start',
		cwd: '../web',
		url: WEB_URL,
		reuseExistingServer: !isCI,
		timeout: 300_000,
		env: webEnv,
	},
});
