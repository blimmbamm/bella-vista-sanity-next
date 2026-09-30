import {ClockIcon, EnvelopeIcon, ThListIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Sections that render shared content (menu, opening hours, contact details)
 * instead of storing it on the page, so both page translations stay in sync.
 */

export const menuSectionType = defineType({
  name: 'menuSection',
  title: 'Menu',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      description: 'Leave empty to show all categories in their sort order.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'menuCategory'}]})],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {title: 'title', categories: 'categories'},
    prepare: ({title, categories}) => ({
      title: title || 'Menu',
      subtitle: categories?.length ? `${categories.length} categories` : 'All categories',
    }),
  },
})

export const openingHoursSectionType = defineType({
  name: 'openingHoursSection',
  title: 'Opening hours',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'showExceptions',
      title: 'Show exceptions (holidays, vacation)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: title || 'Opening hours',
      subtitle: 'Shows the shared opening hours',
    }),
  },
})

export const contactSectionType = defineType({
  name: 'contactSection',
  title: 'Contact details',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'showMap',
      title: 'Show map link',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({
      title: title || 'Contact details',
      subtitle: 'Shows the shared contact & business details',
    }),
  },
})
