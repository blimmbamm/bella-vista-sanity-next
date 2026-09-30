import type { Metadata } from "next";
import { SUPPORTED_LANGS } from "../../i18n/i18n";
import { assertSupportedLang } from "../../src/routing/validateLang";
import { client } from "../../src/sanity/client";
import { metadataQuery } from "../../src/sanity/queries";
import { MetadataQueryResult } from "../../src/sanity/types";
import { SITE_URL } from "../../src/environment";
import { SiteHeader } from "../../components/site-header/SiteHeader";
import Footer from "../../components/footer/Footer";
import { nunitoFont, playfairFont } from "../../styles/font";
import "../../styles/globals.css";

export const dynamic = "error";
export const revalidate = false;

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  assertSupportedLang(lang);

  const metadata = await client.fetch<MetadataQueryResult>(
    metadataQuery,
    { lang },
    { cache: "force-cache" },
  );

  return {
    title: metadata?.seoTitle,
    description: metadata?.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        de: `${SITE_URL}/de`,
        en: `${SITE_URL}/en`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  assertSupportedLang(lang);

  return (
    <html lang={lang} className={`${nunitoFont.variable} ${playfairFont.variable}`}>
      <body>
        <SiteHeader lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
      </body>
    </html>
  );
}
