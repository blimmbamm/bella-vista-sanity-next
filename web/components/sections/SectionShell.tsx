import clsx from 'clsx'
import type {ReactNode} from 'react'
import styles from './SectionShell.module.css'

type Props = {
  children: ReactNode
  className?: string
  title?: string | null
  /** Wider content column, e.g. for the menu grid */
  wide?: boolean
  tone?: 'default' | 'muted'
}

export default function SectionShell({
  children,
  className,
  title,
  wide = false,
  tone = 'default',
}: Props) {
  return (
    <section className={clsx(styles.section, tone === 'muted' && styles.muted, className)}>
      <div className={clsx(styles.inner, wide && styles.innerWide)}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </section>
  )
}
