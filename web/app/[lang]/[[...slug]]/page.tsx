import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeHero } from "../../../components/hero/HomeHero";
import SectionRenderer from "../../../components/sections/SectionRenderer";
import styles from "./page.module.css";
import { assertSupportedLang } from "../../../src/routing/validateLang";
import { parsePathParam, resolvePageUrl } from "../../../src/routing/resolvePageUrl";
import { client } from "../../../src/sanity/client";
import { pageByPathQuery, pathsQuery } from "../../../src/sanity/queries";
import { PageByPathQueryResult, PathsQueryResult } from "../../../src/sanity/types";
import { SITE_URL } from "../../../src/environment";

export const dynamic = "error";
export const revalidate = false;

export async function generateStaticParams({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const pages = await client.fetch<PathsQueryResult>(pathsQuery);

  return pages.flatMap((page) => {
    if (page.language !== lang) {
      return [];
    }

    if (page.isHome) {
      return [{ slug: [] }];
    }

    if (!page.path) {
      return [];
    }

    return [{ slug: page.path.split("/") }];
  });
}

function buildAlternateLanguages(page: NonNullable<PageByPathQueryResult>) {
  const alternates: Record<string, string> = {};

  if (page.language) {
    alternates[page.language] = `${SITE_URL}${resolvePageUrl(page)}`;
  }

  for (const translation of page.translations ?? []) {
    if (translation.page?.language) {
      alternates[translation.page.language] = `${SITE_URL}${resolvePageUrl(translation.page)}`;
    }
  }

  return alternates;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  assertSupportedLang(lang);

  const path = parsePathParam(slug);
  const page = await client.fetch<PageByPathQueryResult>(
    pageByPathQuery,
    { lang, path },
    { cache: "force-cache" },
  );

  if (!page) {
    return {};
  }

  return {
    title: page.seoTitle ?? page.title,
    description: page.description,
    alternates: {
      canonical: `${SITE_URL}${resolvePageUrl(page)}`,
      languages: buildAlternateLanguages(page),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  assertSupportedLang(lang);

  const path = parsePathParam(slug);
  const page = await client.fetch<PageByPathQueryResult>(
    pageByPathQuery,
    { lang, path },
    { cache: "force-cache" },
  );

  if (!page) {
    notFound();
  }

  return (
    <article>
      {page.isHome ? (
        <HomeHero lang={lang} fallbackTitle={page.title} />
      ) : (
        <header className={styles.header}>
          <h1>{page.title}</h1>
        </header>
      )}

      {page.sections && <SectionRenderer sections={page.sections} lang={lang} />}
    </article>
  );
}
