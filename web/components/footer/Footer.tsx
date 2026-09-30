import Link from "next/link";
import { getDictionary } from "../../i18n/dictionary";
import { resolveNavHref, type NavTargetInput } from "../../src/routing/resolveNavHref";
import { client } from "../../src/sanity/client";
import { navigationQuery, siteSettingsQuery } from "../../src/sanity/queries";
import type { NavigationQueryResult, SiteSettingsQueryResult } from "../../src/sanity/types";
import { SITE_NAME } from "../../src/environment";
import { toNavItems, type NavItemData } from "../site-header/navTypes";
import styles from "./Footer.module.css";

type Props = { lang: string };

function flattenLinks(items: NavItemData[]): Array<{ key: string; label: string; href: string; external: boolean }> {
  return items.flatMap((item) => {
    const href = resolveNavHref(item.link as NavTargetInput);
    const own =
      href && item.label
        ? [{ key: item._key, label: item.label, href, external: item.link?.type === "external" }]
        : [];

    return [...own, ...flattenLinks(item.children ?? [])];
  });
}

export default async function Footer({ lang }: Props) {
  const [navigation, settings] = await Promise.all([
    client.fetch<NavigationQueryResult>(navigationQuery, { lang }, { cache: "force-cache" }),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery, {}, { cache: "force-cache" }),
  ]);

  const t = getDictionary(lang);
  const name = settings?.businessName ?? SITE_NAME;
  const address = settings?.address;
  const links = flattenLinks(toNavItems(navigation?.items ?? null));

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.column}>
          <p className={styles.brand}>{name}</p>
          {address?.street && (
            <address className={styles.address}>
              {address.street}
              <br />
              {[address.postalCode, address.city].filter(Boolean).join(" ")}
            </address>
          )}
        </div>

        {(settings?.phone || settings?.email) && (
          <div className={styles.column}>
            <p className={styles.heading}>{t.contact}</p>
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
            )}
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          </div>
        )}

        {links.length > 0 && (
          <nav className={styles.column} aria-label="Footer">
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.key}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <p className={styles.copyright}>
        &copy; {new Date().getFullYear()} {name}
      </p>
    </footer>
  );
}
