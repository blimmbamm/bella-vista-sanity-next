import {MenuIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {getNavItemDepth, NAV_ITEM_MAX_DEPTH} from '../objects/navigation/navItem'

export const navigationType = defineType({
  name: 'navigation',
  title: 'Main Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'German', value: 'de'},
          {title: 'English', value: 'en'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
      readOnly: ({document}) =>
        document?._id === 'navigation-de' ||
        document?._id === 'drafts.navigation-de' ||
        document?._id === 'navigation-en' ||
        document?._id === 'drafts.navigation-en',
    }),
    defineField({
      name: 'items',
      title: 'Navigation items',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
      validation: (rule) =>
        rule.custom((items) => {
          const depth = getNavItemDepth(items as Parameters<typeof getNavItemDepth>[0])
          if (depth > NAV_ITEM_MAX_DEPTH) {
            return `Navigation can be at most ${NAV_ITEM_MAX_DEPTH} levels deep (found ${depth})`
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
    },
    prepare({title, language}) {
      return {
        title: title || 'Main Navigation',
        subtitle: language ? String(language).toUpperCase() : undefined,
      }
    },
  },
})
