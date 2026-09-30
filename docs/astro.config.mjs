// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { project } from './src/project.config.ts';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: `Hilfe · ${project.restaurantName}`,
			defaultLocale: 'root',
			locales: {
				root: { label: 'Deutsch', lang: 'de' },
			},
			customCss: ['./src/styles/custom.css'],
			lastUpdated: false,
			pagination: true,
			sidebar: [
				{
					label: 'Erste Schritte',
					items: [
						'einstieg/ueberblick',
						'einstieg/anmelden',
						'einstieg/studio-rundgang',
					],
				},
				{
					label: 'Inhalte pflegen',
					items: [
						'inhalte/seiten',
						'inhalte/abschnitte',
						'inhalte/speisekarte',
						'inhalte/oeffnungszeiten',
						'inhalte/kontakt',
						'inhalte/navigation',
						'inhalte/bilder',
						'inhalte/uebersetzungen',
					],
				},
				{
					label: 'Veröffentlichen',
					items: ['veroeffentlichen/entwurf', 'veroeffentlichen/website-aktualisieren'],
				},
				{
					label: 'Zusammenarbeit',
					items: ['zusammenarbeit/zustaendigkeiten', 'zusammenarbeit/aenderungswunsch'],
				},
				{
					label: 'Hilfe',
					items: ['hilfe/probleme'],
				},
			],
		}),
	],
});
