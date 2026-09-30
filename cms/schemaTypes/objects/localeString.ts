import {defineField, defineType} from 'sanity'

/**
 * Small per-language text pair, used for fields on documents that are
 * referenced/shared across page translations (e.g. `image`, `images`,
 * `video`). Since those documents are not themselves part of the
 * document-internationalization set, a plain string field would be shared
 * (and therefore un-translated) across every page that references it.
 */
export const localeStringType = defineType({
  name: 'localeString',
  title: 'Localized text',
  type: 'object',
  fieldsets: [{name: 'languages', title: 'Languages', options: {columns: 2}}],
  fields: [
    defineField({
      name: 'de',
      title: 'German',
      type: 'string',
      fieldset: 'languages',
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'string',
      fieldset: 'languages',
    }),
  ],
})
