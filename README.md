# Trattoria Bella Vista

Example restaurant website built to exercise a Sanity + Next.js template: bilingual site (DE/EN), Sanity Studio for content, owner docs, and E2E smoke tests.

Live:

- Website: [bella-vista-tau-six.vercel.app](https://bella-vista-tau-six.vercel.app/de)
- Studio: [trattoria-bella-vista.sanity.studio](https://trattoria-bella-vista.sanity.studio)

## Repository layout

| Folder | Stack | Role |
| --- | --- | --- |
| [`cms/`](cms/) | Sanity Studio | Content model and editorial UI |
| [`web/`](web/) | Next.js | Public website (static pages from Sanity) |
| [`docs/`](docs/) | Astro Starlight | German operator guide |
| [`e2e/`](e2e/) | Playwright | Smoke tests for `web/` |

Each package has its own `package.json`, `.env.example`, and README.

## Local development

Use three terminals (or run what you need):

```bash
# Studio — http://localhost:3333
cd cms && cp .env.example .env && npm install && npm run dev

# Website — http://localhost:3000
cd web && cp .env.example .env && npm install && npm run dev

# Docs — http://localhost:4321
cd docs && npm install && npm run dev
```

Point `cms` and `web` at the same Sanity project. Locally prefer the `development` dataset; production builds and the hosted Studio use `production`.

After schema or GROQ query changes, regenerate types from `cms/`:

```bash
npm run typegen
# or, if extract hangs: npx sanity typegen generate
```

## Content & datasets

- **`development`** — local work, Vercel previews, E2E, docs screenshots
- **`production`** — live website and deployed Studio

Copy production into development when you want a fresh local mirror:

```bash
cd cms && npm run sync:prod-to-dev
```

## Deploy (overview)

- **Website / docs** — separate Vercel projects from this repo (`Root Directory` = `web` or `docs`)
- **Studio** — `cd cms && npm run deploy` (Sanity hosting)
- **Content updates** — Studio “Deploy Website” button triggers a Vercel deploy hook (static rebuild)

Details live in the package READMEs and in `docs/src/project.config.ts` (URLs, contacts for the operator guide).

## Tests

```bash
cd e2e && npm install && npx playwright install chromium && npm test
```

GitHub Actions runs the same suite on pushes and PRs that touch `web/`, `e2e/`, or the workflow (see [`.github/workflows/e2e-web.yml`](.github/workflows/e2e-web.yml)).

Docs screenshots are separate and manual: `cd docs && npm run screenshots` (see [`docs/README.md`](docs/README.md)).
