# Docs

User guide for the restaurant owner: how to maintain content in the Sanity Studio and publish the website. Built with [Astro Starlight](https://starlight.astro.build). The guide itself is written in German.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Per-project values

Restaurant name, URLs, deploy duration and developer contact live in `src/project.config.ts`. Pages read them from there, so the page content stays generic when the template is reused.

## Structure

- `src/content/docs/` holds one `.mdx` file per page. The sidebar order is defined in `astro.config.mjs`.
- `src/components/Screenshot.astro` renders `src/assets/screenshots/<name>.png`, or a placeholder if the file does not exist yet.
- `screenshots/` contains the Playwright scripts that create those images.

## Screenshots

The scripts start `web` (port 3000) and `cms` (port 3333) with `npm run dev`, or reuse servers that are already running. Content comes from the dataset configured in the respective `.env` files. The scripts only read content, they never change it.

The Studio login uses a Sanity API token. Copy `.env.example` to `.env` and set `SANITY_SCREENSHOT_TOKEN` to a token with the Editor role (sanity.io/manage → project → API → Tokens). Viewer works too, but the Studio then shows read-only hints. Before the Studio screenshots, the `studio-auth` setup opens the Studio with `#token=...` and stores the session in `screenshots/.auth/studio.json` (git-ignored).

| Command | Purpose |
| --- | --- |
| `npm run screenshots` | Creates all Studio and website screenshots |
| `npm run screenshots:studio` | Creates only the Studio screenshots |
| `npm run screenshots:web` | Creates only the website screenshots (no token needed) |

The first run requires the Playwright browser: `npx playwright install chromium`.

Sanity occasionally shows announcements or upgrade notices on top of the Studio. `dismissOverlays` in `screenshots/studio.spec.ts` closes the known ones; if a new kind shows up in the screenshots, add its button label there.

Studio pages are opened by URL. The paths follow the ids in `../cms/structure.ts`: list items without an explicit id use `camelCase(title)`. When the Studio structure changes, update `screenshots/studio.spec.ts` accordingly.
