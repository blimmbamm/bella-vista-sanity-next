import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Reference to a shared `singleImage` document. Use this as an inline
 * block inside `sectionContent` when a single image needs to sit in the
 * text flow but stay in sync across page translations.
 */
export const imageRefType = defineType({
  name: 'imageRef',
  title: 'Image (shared)',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'reference',
      to: [{type: 'singleImage'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'image.title', media: 'image.image'},
    prepare: ({title, media}) => ({
      title: title ? `Image: ${title}` : 'Image',
      media,
    }),
  },
})
