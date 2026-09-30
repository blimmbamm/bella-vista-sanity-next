import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const priceFormatter = new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'})

const requireGerman = (value?: {de?: string}) => (value?.de ? true : 'German text is required')

export const dishType = defineType({
  name: 'dish',
  title: 'Dish',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localeString',
      validation: (rule) => rule.custom(requireGerman),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'menuCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Accessibility description',
          type: 'localeString',
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price (EUR)',
      type: 'number',
      description: 'Ignored on the website when variants are set.',
      validation: (rule) =>
        rule
          .min(0)
          .precision(2)
          .custom((value, context) => {
            const variants = (context.document as {variants?: unknown[]} | undefined)?.variants
            if (value === undefined && !variants?.length) {
              return 'Set a price or add variants'
            }
            return true
          }),
    }),
    defineField({
      name: 'variants',
      title: 'Variants',
      description: 'Optional size or portion options, e.g. small/large or 0.33 l/0.5 l.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dishVariant',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'localeString',
              validation: (rule) => rule.custom(requireGerman),
            }),
            defineField({
              name: 'price',
              title: 'Price (EUR)',
              type: 'number',
              validation: (rule) => rule.required().min(0).precision(2),
            }),
          ],
          preview: {
            select: {label: 'label.de', price: 'price'},
            prepare: ({label, price}) => ({
              title: label || 'Variant',
              subtitle: typeof price === 'number' ? priceFormatter.format(price) : undefined,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'available',
      title: 'Available',
      description: 'Uncheck to hide this dish on the website without deleting it.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers are shown first within the category.',
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
    select: {
      nameDe: 'name.de',
      nameEn: 'name.en',
      category: 'category.title.de',
      price: 'price',
      available: 'available',
      media: 'image',
    },
    prepare: ({nameDe, nameEn, category, price, available, media}) => ({
      title: nameDe || nameEn || 'Untitled dish',
      subtitle: [
        category,
        typeof price === 'number' ? priceFormatter.format(price) : undefined,
        available === false ? 'hidden' : undefined,
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
