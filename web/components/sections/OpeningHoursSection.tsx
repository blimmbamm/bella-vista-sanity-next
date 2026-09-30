import clsx from 'clsx'
import {getDictionary, type Dictionary} from '../../i18n/dictionary'
import {formatDate, formatSlots} from '../../src/formatting'
import {client} from '../../src/sanity/client'
import {openingHoursQuery} from '../../src/sanity/queries'
import {resolveLocaleString} from '../../src/sanity/resolveLocaleString'
import type {OpeningHoursQueryResult} from '../../src/sanity/types'
import type {PageSection} from './SectionRenderer'
import SectionShell from './SectionShell'
import styles from './OpeningHoursSection.module.css'

type Props = {
  section: Extract<PageSection, {_type: 'openingHoursSection'}>
  lang: string
}

type Day = keyof Dictionary['weekdays']
type WeeklyEntry = NonNullable<NonNullable<OpeningHoursQueryResult>['weeklyHours']>[number]

const WEEK: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

/** Collapses consecutive weekdays with identical hours into one row, e.g. "Tue – Thu". */
function groupWeek(weeklyHours: WeeklyEntry[], closedLabel: string) {
  const groups: Array<{from: Day; to: Day; hours: string; closed: boolean}> = []

  for (const day of WEEK) {
    const entry = weeklyHours.find((item) => item.day === day)
    const closed = !entry || Boolean(entry.closed) || !entry.slots?.length
    const hours = closed ? closedLabel : formatSlots(entry.slots)
    const previous = groups.at(-1)

    if (previous && previous.hours === hours) {
      previous.to = day
    } else {
      groups.push({from: day, to: day, hours, closed})
    }
  }

  return groups
}

export default async function OpeningHoursSectionBlock({section, lang}: Props) {
  const openingHours = await client.fetch<OpeningHoursQueryResult>(
    openingHoursQuery,
    {},
    {cache: 'force-cache'},
  )

  if (!openingHours) {
    return null
  }

  const t = getDictionary(lang)
  const groups = groupWeek(openingHours.weeklyHours ?? [], t.closed)
  const note = resolveLocaleString(openingHours.note, lang)
  const today = new Date().toISOString().slice(0, 10)
  const exceptions = section.showExceptions
    ? (openingHours.exceptions ?? [])
        .filter((exception) => exception.date && exception.date >= today)
        .sort((a, b) => (a.date as string).localeCompare(b.date as string))
    : []

  return (
    <SectionShell title={section.title} tone="muted">
      <div className={styles.card}>
        <dl className={styles.week}>
          {groups.map((group) => (
            <div key={group.from} className={clsx(styles.row, group.closed && styles.closed)}>
              <dt className={styles.day}>
                {group.from === group.to
                  ? t.weekdays[group.from]
                  : `${t.weekdaysShort[group.from]} – ${t.weekdaysShort[group.to]}`}
              </dt>
              <dd className={styles.hours}>
                {group.hours.split(', ').map((slot) => (
                  <span key={slot}>{slot}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        {note && <p className={styles.note}>{note}</p>}
      </div>

      {exceptions.length > 0 && (
        <div className={styles.exceptions}>
          <h3 className={styles.exceptionsTitle}>{t.specialDates}</h3>
          <ul className={styles.exceptionList}>
            {exceptions.map((exception) => (
              <li key={exception._key} className={styles.exception}>
                <div>
                  <strong>{resolveLocaleString(exception.label, lang)}</strong>
                  <span className={styles.exceptionDate}>
                    {formatDate(exception.date as string, lang)}
                  </span>
                </div>
                <span className={clsx(styles.exceptionHours, exception.closed && styles.closedBadge)}>
                  {exception.closed ? t.closed : formatSlots(exception.slots)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionShell>
  )
}
