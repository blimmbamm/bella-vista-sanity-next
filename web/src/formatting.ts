import { getDictionary } from "../i18n/dictionary";

export function formatPrice(price: number, lang: string) {
  return new Intl.NumberFormat(getDictionary(lang).locale, {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

/** Formats a `YYYY-MM-DD` Sanity date without shifting it by the local time zone. */
export function formatDate(date: string, lang: string) {
  return new Intl.DateTimeFormat(getDictionary(lang).locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatSlots(
  slots: Array<{ opens: string | null; closes: string | null }> | null,
) {
  return (slots ?? [])
    .map((slot) => `${slot.opens ?? "?"} – ${slot.closes ?? "?"}`)
    .join(", ");
}
