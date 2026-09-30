import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

if (existsSync('.env')) {
	process.loadEnvFile('.env');
}

const STUDIO_URL = process.env.STUDIO_URL ?? 'http://localhost:3333';
const WEB_URL = process.env.WEB_URL ?? 'http://localhost:3000';

export const AUTH_FILE = 'screenshots/.auth/studio.json';

export default defineConfig({
	testDir: './screenshots',
	outputDir: './screenshots/.results',
	workers: 1,
	reporter: 'list',
	timeout: 90_000,
	use: {
		viewport: { width: 1440, height: 900 },
		locale: 'de-DE',
		colorScheme: 'light',
		actionTimeout: 15_000,
	},
	projects: [
		{
			name: 'studio-auth',
			testMatch: /auth\.setup\.ts/,
			use: { baseURL: STUDIO_URL },
		},
		{
			name: 'studio',
			testMatch: /studio\.spec\.ts/,
			dependencies: ['studio-auth'],
			use: { baseURL: STUDIO_URL, storageState: AUTH_FILE },
		},
		{
			name: 'web',
			testMatch: /web\.spec\.ts/,
			use: { baseURL: WEB_URL },
		},
	],
	webServer: [
		{
			command: 'npm run dev',
			cwd: '../web',
			url: WEB_URL,
			reuseExistingServer: true,
			timeout: 180_000,
		},
		{
			command: 'npm run dev',
			cwd: '../cms',
			url: STUDIO_URL,
			reuseExistingServer: true,
			timeout: 180_000,
		},
	],
});
