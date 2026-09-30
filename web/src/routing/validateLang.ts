import { notFound } from 'next/navigation'
import { SUPPORTED_LANGS } from '../../i18n/i18n'

export function assertSupportedLang(lang: string) {
  if (!SUPPORTED_LANGS.includes(lang as (typeof SUPPORTED_LANGS)[number])) {
    notFound()
  }
}
