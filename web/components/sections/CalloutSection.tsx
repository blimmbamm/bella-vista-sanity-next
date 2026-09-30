import type {PageSection} from './SectionRenderer'
import SectionPortableText from './SectionPortableText'
import SectionShell from './SectionShell'
import styles from './CalloutSection.module.css'

type Props = {
  section: Extract<PageSection, {_type: 'calloutSection'}>
  lang: string
}

export default function CalloutSectionBlock({section, lang}: Props) {
  return (
    <SectionShell>
      <aside className={styles.callout}>
        {section.title && <h2 className={styles.title}>{section.title}</h2>}
        <div className={styles.body}>
          <SectionPortableText content={section.content} lang={lang} />
        </div>
      </aside>
    </SectionShell>
  )
}
