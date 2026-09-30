import {ClockIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/

export const timeSlotType = defineType({
  name: 'timeSlot',
  title: 'Time slot',
  type: 'object',
  icon: ClockIcon,
  fieldsets: [{name: 'times', options: {columns: 2}}],
  fields: [
    defineField({
      name: 'opens',
      title: 'Opens',
      type: 'string',
      placeholder: '11:00',
      fieldset: 'times',
      validation: (rule) =>
        rule.required().regex(timePattern, {name: 'HH:MM'}).error('Use the format HH:MM'),
    }),
    defineField({
      name: 'closes',
      title: 'Closes',
      type: 'string',
      placeholder: '22:00',
      description: 'Use 24:00 or an earlier time than "Opens" for slots past midnight.',
      fieldset: 'times',
      validation: (rule) =>
        rule
          .required()
          .regex(/^(([01]\d|2[0-3]):[0-5]\d|24:00)$/, {name: 'HH:MM'})
          .error('Use the format HH:MM'),
    }),
  ],
  preview: {
    select: {opens: 'opens', closes: 'closes'},
    prepare: ({opens, closes}) => ({
      title: `${opens || '?'} – ${closes || '?'}`,
    }),
  },
})
