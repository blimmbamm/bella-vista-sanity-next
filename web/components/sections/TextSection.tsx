import type {PageSection} from './SectionRenderer'
import SectionPortableText from './SectionPortableText'
import SectionShell from './SectionShell'
import styles from './TextSection.module.css'

type Props = {
  section: Extract<PageSection, {_type: 'textSection'}>
  lang: string
}

export default function TextSectionBlock({section, lang}: Props) {
  return (
    <SectionShell>
      <div className={styles.prose}>
        <SectionPortableText content={section.content} lang={lang} />
      </div>
    </SectionShell>
  )
}
