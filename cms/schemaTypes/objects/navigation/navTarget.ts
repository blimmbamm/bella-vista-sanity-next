import {LinkIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const navTargetType = defineType({
  name: 'navTarget',
  title: 'Link target',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal page', value: 'internal'},
          {title: 'External URL', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}],
      options: {
        filter: ({document}) => {
          const language = document?.language
          if (!language) {
            return {filter: 'false'}
          }
          return {
            filter: 'language == $language',
            params: {language},
          }
        },
        disableNew: true,
      },
      hidden: ({parent}) => parent?.type !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {type?: string} | undefined
          if (parent?.type === 'internal' && !value) {
            return 'Select a page for internal links'
          }
          return true
        }),
    }),
    defineField({
      name: 'hash',
      title: 'Hash / anchor',
      type: 'string',
      description: 'Optional section id without "#", e.g. "kontakt".',
      hidden: ({parent}) => parent?.type !== 'internal',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
            return 'Use letters, numbers, hyphens, or underscores only (no "#")'
          }
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.type !== 'external',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}).custom((value, context) => {
          const parent = context.parent as {type?: string} | undefined
          if (parent?.type === 'external' && !value) {
            return 'Enter a URL for external links'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      type: 'type',
      pageTitle: 'page.title',
      href: 'href',
      hash: 'hash',
    },
    prepare({type, pageTitle, href, hash}) {
      if (type === 'external') {
        return {title: href || 'External link', subtitle: 'External'}
      }
      const title = pageTitle || 'Internal page'
      return {
        title: hash ? `${title} #${hash}` : title,
        subtitle: 'Internal',
      }
    },
  },
})
