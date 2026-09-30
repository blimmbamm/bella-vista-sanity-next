# E2E

Smoke tests for the Next.js site in `../web`, run with Playwright against a production build (`next build` + `next start`).

## Setup

```bash
npm install
npx playwright install chromium
```

The build uses the Sanity `development` dataset by default (override with `NEXT_PUBLIC_*` env vars if needed). No API token is required.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Build the site if needed, start it, run all tests |
| `npm run test:ui` | Same, with the Playwright UI |

If `web` is already running on port 3000 locally, Playwright reuses that server (skipping the build). Prefer a production server (`npm run build && npm run start` in `web/`) when testing locally.

## CI

GitHub Actions runs on every push/PR to `main` so required status checks always get a result. The Playwright suite only runs when `web/`, `e2e/`, or the workflow file changed; otherwise the job succeeds immediately. See `.github/workflows/e2e-web.yml`.
