# Web

Next.js frontend for the restaurant website. All content (pages, navigation, menu, opening hours, contact details) comes from the Sanity project in `../cms`.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root URL redirects to `/de` or `/en` based on the browser language.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical and alternate language links |
| `NEXT_PUBLIC_SITE_NAME` | Fallback name if no business name is set in the CMS |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (same as in `cms/.env`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, use `production` for live builds |

## Structure

- `app/[lang]/[[...slug]]` renders every CMS page. `app/[lang]/layout.tsx` provides header, footer and fonts.
- `components/sections` contains one component per CMS section type (text, callout, menu, opening hours, contact).
- `components/site-header` contains the header with the navigation drawer and language switch.
- `src/sanity/queries.ts` holds all GROQ queries; `src/sanity/types.ts` is generated from them.
- `i18n/dictionary.ts` holds the UI texts for German and English.

## Types

After changing a query or the CMS schema, regenerate the types from the `cms` folder:

```bash
npx sanity typegen generate
```

## Static build

`npm run build` prerenders all CMS pages as static HTML. The languages come from `generateStaticParams` in `app/[lang]/layout.tsx`, the page paths from `generateStaticParams` in the page. New or changed content only appears after a new build, e.g. triggered by the deploy tool in the Studio.
