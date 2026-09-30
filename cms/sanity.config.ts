import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'
import {deployTool} from './plugins/deployTool'
import {SINGLETON_TYPES, structure} from './structure'

const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: process.env.SANITY_STUDIO_TITLE ?? 'Content Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    structureTool({structure}),
    visionTool(),
    deployTool(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'de', title: 'German'},
        {id: 'en', title: 'English'},
      ],
      schemaTypes: ['page'],
      languageField: 'language',
      allowCreateMetaDoc: true,
      apiVersion: '2026-01-18',
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter(
        (template) =>
          template.schemaType !== 'navigation' && !SINGLETON_TYPES.has(template.schemaType),
      ),
      {
        id: 'navigation-de',
        title: 'Main Navigation (DE)',
        schemaType: 'navigation',
        value: {
          title: 'Main Navigation (DE)',
          language: 'de',
        },
      },
      {
        id: 'navigation-en',
        title: 'Main Navigation (EN)',
        schemaType: 'navigation',
        value: {
          title: 'Main Navigation (EN)',
          language: 'en',
        },
      },
      {
        id: 'dish-by-category',
        title: 'Dish in category',
        schemaType: 'dish',
        parameters: [{name: 'categoryId', type: 'string'}],
        value: ({categoryId}: {categoryId: string}) => ({
          category: {_type: 'reference', _ref: categoryId},
        }),
      },
    ],
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((item) => item.templateId !== 'dish-by-category')
        : prev,
    actions: (prev, {schemaType}) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : prev,
  },
})
