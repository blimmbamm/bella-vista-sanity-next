import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const menuCategoryType = defineType({
  name: 'menuCategory',
  title: 'Menu category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (rule) =>
        rule.custom((value?: {de?: string}) => (value?.de ? true : 'German title is required')),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers are shown first.',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {titleDe: 'title.de', titleEn: 'title.en', sortOrder: 'sortOrder'},
    prepare: ({titleDe, titleEn, sortOrder}) => ({
      title: titleDe || titleEn || 'Untitled category',
      subtitle: sortOrder !== undefined ? `#${sortOrder}` : undefined,
    }),
  },
})
