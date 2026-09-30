import {BlockContentIcon, BulbOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {CalloutSectionItem, TextSectionItem} from '../../../components/sections/SectionItems'
import {CalloutSectionPreview, TextSectionPreview} from '../../../components/sections/SectionPreviews'

export const textSectionType = defineType({
  name: 'textSection',
  title: 'Text section',
  type: 'object',
  icon: BlockContentIcon,
  components: {
    item: TextSectionItem,
    preview: TextSectionPreview,
  },
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'sectionContent',
    }),
  ],
})

export const calloutSectionType = defineType({
  name: 'calloutSection',
  title: 'Callout section',
  type: 'object',
  icon: BulbOutlineIcon,
  components: {
    item: CalloutSectionItem,
    preview: CalloutSectionPreview,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'sectionContent',
    }),
  ],
})
