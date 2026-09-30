import type { NavigationQueryResult } from "../../src/sanity/types";

/** Flattened recursive shape for up to 3 levels from `navigationQuery`. */
export type NavItemData = {
  _key: string;
  label?: string | null;
  link?: {
    type?: "external" | "internal" | string | null;
    hash?: string | null;
    href?: string | null;
    openInNewTab?: boolean | null;
    page?: {
      _id?: string;
      title?: string | null;
      path?: string | null;
      isHome?: boolean | null;
      language?: string | null;
    } | null;
  } | null;
  children?: NavItemData[] | null;
};

export function toNavItems(
  items: NonNullable<NavigationQueryResult>["items"],
): NavItemData[] {
  return (items ?? []) as NavItemData[];
}
