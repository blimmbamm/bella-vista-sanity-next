import { SUPPORTED_LANGS } from "../../i18n/i18n";
import { resolvePageUrl } from "../../src/routing/resolvePageUrl";
import { client } from "../../src/sanity/client";
import {
  navigationQuery,
  pageTranslationsQuery,
  siteSettingsQuery,
} from "../../src/sanity/queries";
import type {
  NavigationQueryResult,
  PageTranslationsQueryResult,
  SiteSettingsQueryResult,
} from "../../src/sanity/types";
import { SITE_NAME } from "../../src/environment";
import { SiteNav, type LanguageAlternates } from "./SiteNav";
import { toNavItems } from "./navTypes";

type Props = {
  lang: string;
};

function buildLanguageAlternates(pages: PageTranslationsQueryResult): LanguageAlternates {
  const alternates: LanguageAlternates = {};

  for (const page of pages) {
    const links: Record<string, string> = {};

    for (const lang of SUPPORTED_LANGS) {
      links[lang] = `/${lang}`;
    }

    for (const translation of page.translations ?? []) {
      if (translation?.language) {
        links[translation.language] = resolvePageUrl(translation);
      }
    }

    alternates[resolvePageUrl(page)] = links;
  }

  return alternates;
}

export async function SiteHeader({ lang }: Props) {
  const [navigation, settings, pages] = await Promise.all([
    client.fetch<NavigationQueryResult>(navigationQuery, { lang }, { cache: "force-cache" }),
    client.fetch<SiteSettingsQueryResult>(siteSettingsQuery, {}, { cache: "force-cache" }),
    client.fetch<PageTranslationsQueryResult>(pageTranslationsQuery, {}, { cache: "force-cache" }),
  ]);

  return (
    <SiteNav
      items={toNavItems(navigation?.items ?? null)}
      lang={lang}
      languages={[...SUPPORTED_LANGS]}
      languageAlternates={buildLanguageAlternates(pages)}
      brand={settings?.businessName ?? SITE_NAME ?? ""}
      phone={settings?.phone ?? null}
      address={settings?.address ?? null}
    />
  );
}
