import {MenuIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Max nesting depth for navigation items (root = 1). */
export const NAV_ITEM_MAX_DEPTH = 3

type NavItemNode = {
  label?: string
  children?: NavItemNode[]
}

export function getNavItemDepth(items: NavItemNode[] | undefined, depth = 1): number {
  if (!items?.length) {
    return depth - 1
  }

  return Math.max(
    depth,
    ...items.map((item) => getNavItemDepth(item.children, depth + 1)),
  )
}

export const navItemType = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'navTarget',
      description: 'Optional. Leave empty for a group label without its own URL.',
    }),
    defineField({
      name: 'children',
      title: 'Child items',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
      description: `Optional nested items. Maximum depth is ${NAV_ITEM_MAX_DEPTH} levels.`,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      linkType: 'link.type',
      childCount: 'children.length',
    },
    prepare({title, linkType, childCount}) {
      const parts: string[] = []
      if (linkType === 'internal') parts.push('Internal link')
      else if (linkType === 'external') parts.push('External link')
      else parts.push('Group')
      if (childCount) parts.push(`${childCount} child${childCount === 1 ? '' : 'ren'}`)
      return {
        title: title || 'Untitled',
        subtitle: parts.join(' · '),
      }
    },
  },
})
