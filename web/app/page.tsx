import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "../i18n/i18n";

async function getPreferredLang() {
  const headers = await nextHeaders();
  const acceptLanguage = headers.get("accept-language");

  if (!acceptLanguage) return DEFAULT_LANG;

  for (const lang of SUPPORTED_LANGS) {
    if (acceptLanguage.toLowerCase().startsWith(lang)) {
      return lang;
    }
  }

  return DEFAULT_LANG;
}

export default async function RootPage() {
  const lang = await getPreferredLang();
  redirect(`/${lang}`);
}
