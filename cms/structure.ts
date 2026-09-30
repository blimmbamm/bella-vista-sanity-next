import {ClockIcon, HomeIcon, ThListIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

export const SINGLETON_TYPES = new Set(['openingHours', 'siteSettings'])

const HIDDEN_FROM_TYPE_LIST = new Set([
  'page',
  'navigation',
  'translation.metadata',
  'dish',
  'menuCategory',
  ...SINGLETON_TYPES,
])

const SORT_ORDER = [{field: 'sortOrder', direction: 'asc' as const}]

export const structure: StructureResolver = (S) => {
  const pageItems = [
    S.listItem()
      .title('Homepages')
      .child(
        S.documentList()
          .title('Homepages')
          .filter('_type == "page" && isHome == true')
          .defaultOrdering([{field: 'language', direction: 'asc'}]),
      ),
    S.listItem()
      .title('All pages')
      .child(
        S.documentList()
          .title('All pages')
          .filter('_type == "page"')
          .defaultOrdering([
            {field: 'language', direction: 'asc'},
            {field: 'title', direction: 'asc'},
          ]),
      ),
  ]

  const menuItems = S.listItem()
    .title('Menu')
    .icon(ThListIcon)
    .child(
      S.list()
        .title('Menu')
        .items([
          S.listItem()
            .title('Categories')
            .schemaType('menuCategory')
            .child(
              S.documentTypeList('menuCategory').title('Categories').defaultOrdering(SORT_ORDER),
            ),
          S.listItem()
            .title('Dishes by category')
            .child(
              S.documentTypeList('menuCategory')
                .title('Dishes by category')
                .defaultOrdering(SORT_ORDER)
                .child((categoryId) =>
                  S.documentList()
                    .title('Dishes')
                    .schemaType('dish')
                    .filter('_type == "dish" && category._ref == $categoryId')
                    .params({categoryId})
                    .defaultOrdering(SORT_ORDER)
                    .initialValueTemplates([
                      S.initialValueTemplateItem('dish-by-category', {categoryId}),
                    ]),
                ),
            ),
          S.listItem()
            .title('All dishes')
            .schemaType('dish')
            .child(S.documentTypeList('dish').title('All dishes').defaultOrdering(SORT_ORDER)),
        ]),
    )

  const singletonItem = (type: string, title: string, icon: typeof ClockIcon) =>
    S.listItem()
      .title(title)
      .id(type)
      .icon(icon)
      .child(S.document().schemaType(type).documentId(type).title(title))

  const navigationItems = S.listItem()
    .title('Main Navigation')
    .child(
      S.list()
        .title('Main Navigation')
        .items([
          S.listItem()
            .title('German')
            .id('navigation-de')
            .child(
              S.document()
                .schemaType('navigation')
                .documentId('navigation-de')
                .title('Main Navigation (DE)')
                .initialValueTemplate('navigation-de'),
            ),
          S.listItem()
            .title('English')
            .id('navigation-en')
            .child(
              S.document()
                .schemaType('navigation')
                .documentId('navigation-en')
                .title('Main Navigation (EN)')
                .initialValueTemplate('navigation-en'),
            ),
        ]),
    )

  const otherDocumentTypes = S.documentTypeListItems().filter(
    (item) => !HIDDEN_FROM_TYPE_LIST.has(item.getId() ?? ''),
  )

  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .child(S.list().title('Pages').items(pageItems)),
      S.divider(),
      menuItems,
      singletonItem('openingHours', 'Opening hours', ClockIcon),
      singletonItem('siteSettings', 'Contact & business details', HomeIcon),
      S.divider(),
      navigationItems,
      S.divider(),
      ...otherDocumentTypes,
    ])
}
