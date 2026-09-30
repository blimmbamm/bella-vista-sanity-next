import {ClockIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const WEEKDAYS = [
  {title: 'Monday', value: 'mon'},
  {title: 'Tuesday', value: 'tue'},
  {title: 'Wednesday', value: 'wed'},
  {title: 'Thursday', value: 'thu'},
  {title: 'Friday', value: 'fri'},
  {title: 'Saturday', value: 'sat'},
  {title: 'Sunday', value: 'sun'},
]

const slotsField = defineField({
  name: 'slots',
  title: 'Time slots',
  description: 'Add a second slot for a lunch break.',
  type: 'array',
  of: [defineArrayMember({type: 'timeSlot'})],
  hidden: ({parent}) => Boolean(parent?.closed),
  validation: (rule) =>
    rule.custom((slots, context) => {
      const parent = context.parent as {closed?: boolean} | undefined
      if (!parent?.closed && !slots?.length) {
        return 'Add at least one time slot or mark as closed'
      }
      return true
    }),
})

const formatSlots = (closed?: boolean, slots?: Array<{opens?: string; closes?: string}>) =>
  closed
    ? 'Closed'
    : slots?.map((slot) => `${slot.opens ?? '?'}–${slot.closes ?? '?'}`).join(', ') || 'No times'

export const openingHoursType = defineType({
  name: 'openingHours',
  title: 'Opening hours',
  type: 'document',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'weeklyHours',
      title: 'Regular opening hours',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'openingHoursDay',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: {list: WEEKDAYS},
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'closed',
              title: 'Closed',
              type: 'boolean',
              initialValue: false,
            }),
            slotsField,
          ],
          preview: {
            select: {day: 'day', closed: 'closed', slots: 'slots'},
            prepare: ({day, closed, slots}) => ({
              title: WEEKDAYS.find((weekday) => weekday.value === day)?.title ?? 'Day',
              subtitle: formatSlots(closed, slots),
            }),
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((days?: Array<{day?: string}>) => {
          const values = (days ?? []).map((entry) => entry.day).filter(Boolean)
          return new Set(values).size === values.length || 'Each weekday may only appear once'
        }),
    }),
    defineField({
      name: 'exceptions',
      title: 'Exceptions',
      description: 'Holidays, vacation, or other days with different hours.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'openingHoursException',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'date',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'localeString',
              description: 'E.g. "Christmas" or "Vacation".',
            }),
            defineField({
              name: 'closed',
              title: 'Closed',
              type: 'boolean',
              initialValue: true,
            }),
            slotsField,
          ],
          preview: {
            select: {date: 'date', label: 'label.de', closed: 'closed', slots: 'slots'},
            prepare: ({date, label, closed, slots}) => ({
              title: [date, label].filter(Boolean).join(' · ') || 'Exception',
              subtitle: formatSlots(closed, slots),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'localeText',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Opening hours'}),
  },
})
