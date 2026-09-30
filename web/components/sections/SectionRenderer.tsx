import {PageByPathQueryResult} from '../../src/sanity/types'
import CalloutSectionBlock from './CalloutSection'
import ContactSectionBlock from './ContactSection'
import MenuSectionBlock from './MenuSection'
import OpeningHoursSectionBlock from './OpeningHoursSection'
import TextSectionBlock from './TextSection'

export type PageSection = NonNullable<
  NonNullable<PageByPathQueryResult>['sections']
>[number]

type Props = {
  sections: PageSection[] | null | undefined
  lang: string
}

export default function SectionRenderer({sections, lang}: Props) {
  if (!sections?.length) {
    return null
  }

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'textSection':
            return <TextSectionBlock key={section._key} section={section} lang={lang} />

          case 'calloutSection':
            return <CalloutSectionBlock key={section._key} section={section} lang={lang} />

          case 'menuSection':
            return <MenuSectionBlock key={section._key} section={section} lang={lang} />

          case 'openingHoursSection':
            return <OpeningHoursSectionBlock key={section._key} section={section} lang={lang} />

          case 'contactSection':
            return <ContactSectionBlock key={section._key} section={section} lang={lang} />

          default:
            return null
        }
      })}
    </>
  )
}
