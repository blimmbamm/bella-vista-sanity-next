import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  deployment: {
    // appId is set automatically after running `npm run deploy` in cms/
    autoUpdates: true,
  },
  typegen: {
    path: '../web/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../web/src/sanity/types.ts',
  },
})
