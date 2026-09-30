import { resolvePageUrl } from "./resolvePageUrl";

export type NavTargetInput = {
  type?: "internal" | "external" | string | null;
  hash?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
  page?: {
    language?: string | null;
    path?: string | null;
    isHome?: boolean | null;
  } | null;
} | null;

export function resolveNavHref(link: NavTargetInput): string | null {
  if (!link?.type) {
    return null;
  }

  if (link.type === "external") {
    return link.href ?? null;
  }

  if (link.type === "internal") {
    if (!link.page) {
      return null;
    }

    const base = resolvePageUrl(link.page);
    const hash = link.hash?.replace(/^#/, "");
    return hash ? `${base}#${hash}` : base;
  }

  return null;
}

/**
 * Home is `/{lang}` only — never treat deeper paths as "under home".
 * Other links use exact match or prefix (`/de/docs` active on `/de/docs/foo`).
 */
export function isNavHrefActive(pathname: string, href: string | null): boolean {
  if (!href) {
    return false;
  }

  const pathOnly = href.split("#")[0] ?? href;
  if (!pathOnly) {
    return false;
  }

  if (pathname === pathOnly) {
    return true;
  }

  const segments = pathOnly.split("/").filter(Boolean);
  // `/{lang}` (home): exact match only
  if (segments.length <= 1) {
    return false;
  }

  return pathname.startsWith(`${pathOnly}/`);
}
