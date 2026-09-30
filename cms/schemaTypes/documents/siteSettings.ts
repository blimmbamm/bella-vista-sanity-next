import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Contact & business details',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ownerName',
      title: 'Owner / authorized representative',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({name: 'street', title: 'Street and number', type: 'string'}),
        defineField({name: 'postalCode', title: 'Postal code', type: 'string'}),
        defineField({name: 'city', title: 'City', type: 'string'}),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'Deutschland',
        }),
      ],
      validation: (rule) =>
        rule.custom((value?: {street?: string; postalCode?: string; city?: string}) =>
          value?.street && value?.postalCode && value?.city
            ? true
            : 'Street, postal code and city are required',
        ),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
    }),
    defineField({
      name: 'vatId',
      title: 'VAT ID (USt-IdNr.)',
      type: 'string',
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Map link',
      description: 'E.g. a Google Maps or OpenStreetMap link to the shop.',
      type: 'url',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Other', value: 'other'},
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'businessName'},
    prepare: ({title}) => ({title: title || 'Contact & business details'}),
  },
})
