import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * A single, standalone image document. Reference this (via `imageRef`)
 * when the same image should stay in sync across page translations —
 * for a one-off image used on a single page, prefer inlining a plain
 * `image` field instead.
 */
export const imageType = defineType({
  name: 'singleImage',
  title: 'Image',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal label, only used to identify this image in the Studio.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Accessibility description',
      type: 'localeString',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'localeString',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'image', altDe: 'alt.de', altEn: 'alt.en'},
    prepare: ({title, media, altDe, altEn}) => ({
      title: title || altDe || altEn || 'Untitled image',
      media,
    }),
  },
})
