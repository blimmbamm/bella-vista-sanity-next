import {defineField, defineType} from 'sanity'

export const linkAnnotation = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'href',
      type: 'string',
    }),
  ],
})
