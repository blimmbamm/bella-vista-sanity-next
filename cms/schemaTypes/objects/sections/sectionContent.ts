import {defineArrayMember, defineType} from 'sanity'

export const sectionContentType = defineType({
  name: 'sectionContent',
  title: 'Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
      ],
      marks: {
        annotations: [
          {
            type: 'link',
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'imageRef',
    }),
  ],
})
