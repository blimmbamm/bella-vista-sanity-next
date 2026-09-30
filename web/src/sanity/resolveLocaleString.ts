import type { LocaleString, LocaleText } from "./types";

/**
 * Resolve a `localeString` / `localeText` field (used on documents shared
 * across page translations, e.g. dishes, opening hours, `singleImage`) to a
 * plain string for the given language. Falls back to German, then
 * English, so missing translations don't render as empty text.
 */
export function resolveLocaleString(
  value: LocaleString | LocaleText | null | undefined,
  lang: string,
): string | undefined {
  if (!value) {
    return undefined;
  }

  const record = value as Record<string, string | undefined>;

  return record[lang] || record.de || record.en || undefined;
}
