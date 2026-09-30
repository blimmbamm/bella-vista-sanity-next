import {defineField, defineType} from 'sanity'

export const metadataType = defineType({
  name: 'metadata',
  title: 'Metadata (for SEO)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) =>
        Rule.max(160).warning('Meta descriptions should be under 160 characters'),
      description: 'Recommended: 140–160 characters',
    }),

    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'German', value: 'de'},
          {title: 'English', value: 'en'},
        ],
        layout: 'radio',
      },
    }),
  ],
})
