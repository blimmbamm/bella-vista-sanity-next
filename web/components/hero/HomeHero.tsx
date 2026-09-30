import { getDictionary } from "../../i18n/dictionary";
import { client } from "../../src/sanity/client";
import { metadataQuery, siteSettingsQuery } from "../../src/sanity/queries";
import type { MetadataQueryResult, SiteSettingsQueryResult } from "../../src/sanity/types";
import styles from "./HomeHero.module.css";

type Props = {
  lang: string;
  fallbackTitle: string | null;
};

export async function HomeHero({ lang, fallbackTitle }: Props) {
  const [metadata, settings] = await Promise.all([
    client.fetch<MetadataQueryResult>(metadataQuery, { lang }, { cache: "force-cache" }),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery, {}, { cache: "force-cache" }),
  ]);

  const t = getDictionary(lang);
  const title = settings?.businessName ?? metadata?.title ?? fallbackTitle;
  const location = [settings?.address?.street, settings?.address?.city].filter(Boolean).join(", ");

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {location && <p className={styles.eyebrow}>{location}</p>}
        <h1 className={styles.title}>{title}</h1>
        {metadata?.description && <p className={styles.tagline}>{metadata.description}</p>}

        <div className={styles.actions}>
          {settings?.phone && (
            <a
              className={styles.primary}
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
            >
              {t.reserveTable}
            </a>
          )}
          {settings?.mapsUrl && (
            <a
              className={styles.secondary}
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.directions}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
