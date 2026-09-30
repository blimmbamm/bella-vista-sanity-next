import {defineField, defineType} from 'sanity'

/** Segments: lowercase letters/digits, optional hyphenated parts; joined by `/`. */
const pathPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO & page title',
      type: 'string',
    }),

    defineField({
      name: 'description',
      title: 'Description (for SEO)',
      type: 'text',
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

    defineField({
      name: 'path',
      title: 'Path',
      type: 'string',
      description:
        'URL path without language prefix, e.g. "about", "about-us", or "blog/post-1".',
      validation: (rule) =>
        rule.custom(async (path, context) => {
          // Treat null/undefined like false (legacy docs often omit isHome).
          const isHome = Boolean(context.document?.isHome)

          if (isHome && path) {
            return 'Home page must not have a path'
          }

          if (!isHome && !path) {
            return 'Non-home pages must have a path'
          }

          if (path && !pathPattern.test(path)) {
            return 'Path must use lowercase letters, numbers, hyphens, and slashes only'
          }

          if (!path || !context.document?.language) {
            return true
          }

          const {document, getClient} = context
          const client = getClient({apiVersion: '2026-01-18'})
          const baseId = document._id
            .replace(/^drafts\./, '')
            .replace(/^versions\.[^.]+\./, '')

          const count = await client.fetch(
            `
              count(*[
                _type == "page" &&
                path == $path &&
                language == $language &&
                !(_id in [$id, "drafts." + $id])
              ])
            `,
            {
              path,
              language: document.language,
              id: baseId,
            },
          )

          return count === 0 || 'Path must be unique for this language'
        }),
    }),

    defineField({
      name: 'isHome',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {type: 'textSection'},
        {type: 'calloutSection'},
        {type: 'menuSection'},
        {type: 'openingHoursSection'},
        {type: 'contactSection'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      path: 'path',
      isHome: 'isHome',
    },
    prepare({title, language, path, isHome}) {
      const details = [language, isHome ? 'home' : path].filter(Boolean)

      return {
        title: title || 'Untitled',
        subtitle: details.join(' · '),
      }
    },
  },
})
