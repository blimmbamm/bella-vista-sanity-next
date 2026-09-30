import {getDictionary} from '../../i18n/dictionary'
import {client} from '../../src/sanity/client'
import {siteSettingsQuery} from '../../src/sanity/queries'
import type {SiteSettingsQueryResult} from '../../src/sanity/types'
import type {PageSection} from './SectionRenderer'
import SectionShell from './SectionShell'
import styles from './ContactSection.module.css'

type Props = {
  section: Extract<PageSection, {_type: 'contactSection'}>
  lang: string
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
}

export default async function ContactSectionBlock({section, lang}: Props) {
  const settings = await client.fetch<SiteSettingsQueryResult>(
    siteSettingsQuery,
    {},
    {cache: 'force-cache'},
  )

  if (!settings) {
    return null
  }

  const t = getDictionary(lang)
  const {address} = settings
  const socialLinks = (settings.socialLinks ?? []).filter((link) => link.url)

  return (
    <SectionShell title={section.title} wide>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{t.address}</h3>
          <address className={styles.address}>
            {settings.businessName && <strong>{settings.businessName}</strong>}
            {address?.street && <span>{address.street}</span>}
            {(address?.postalCode || address?.city) && (
              <span>{[address.postalCode, address.city].filter(Boolean).join(' ')}</span>
            )}
            {address?.country && <span>{address.country}</span>}
          </address>
          {section.showMap && settings.mapsUrl && (
            <a
              className={styles.button}
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.openMap}
            </a>
          )}
        </div>

        {(settings.phone || settings.email) && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t.contact}</h3>
            <dl className={styles.details}>
              {settings.phone && (
                <div>
                  <dt>{t.phone}</dt>
                  <dd>
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                  </dd>
                </div>
              )}
              {settings.email && (
                <div>
                  <dt>{t.email}</dt>
                  <dd>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </dd>
                </div>
              )}
            </dl>
            {socialLinks.length > 0 && (
              <ul className={styles.social} aria-label={t.socialMedia}>
                {socialLinks.map((link) => (
                  <li key={link._key}>
                    <a href={link.url as string} target="_blank" rel="noopener noreferrer">
                      {PLATFORM_LABELS[link.platform ?? ''] ?? new URL(link.url as string).hostname}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(settings.ownerName || settings.vatId) && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>{t.operator}</h3>
            <dl className={styles.details}>
              {settings.ownerName && (
                <div>
                  <dt>{t.owner}</dt>
                  <dd>{settings.ownerName}</dd>
                </div>
              )}
              {settings.vatId && (
                <div>
                  <dt>{t.vatId}</dt>
                  <dd>{settings.vatId}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </SectionShell>
  )
}
