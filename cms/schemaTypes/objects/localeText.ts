import {defineField, defineType} from 'sanity'

/** Multi-line counterpart to `localeString`, for longer texts on shared documents. */
export const localeTextType = defineType({
  name: 'localeText',
  title: 'Localized text (multi-line)',
  type: 'object',
  fields: [
    defineField({
      name: 'de',
      title: 'German',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 3,
    }),
  ],
})
