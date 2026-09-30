# CMS

Sanity Studio for the restaurant website. The frontend lives in `../web`.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Studio locally |
| `npm run deploy` | Deploy the Studio |
| `npm run typegen` | Extract the schema to `schema.json` and generate `../web/src/sanity/types.ts` |
| `npm run sync:prod-to-dev` | Copy the `production` dataset into `development` |

## Content model

- **Pages** (`page`) per language, linked as translations. Sections: text, callout, menu, opening hours, contact details.
- **Navigation** (`navigation`) per language.
- **Shared content** used by both languages: dishes and menu categories, opening hours, contact & business details, images.

## Known issue

`npm run typegen` can hang at the `sanity schema extract` step. If `schema.json` is already up to date, run only the second step:

```bash
npx sanity typegen generate
```
