"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { getDictionary } from "../../i18n/dictionary";
import {
  isNavHrefActive,
  resolveNavHref,
  type NavTargetInput,
} from "../../src/routing/resolveNavHref";
import type { NavItemData } from "./navTypes";
import styles from "./SiteNav.module.css";

/** Page URL → URL of the same page per language. */
export type LanguageAlternates = Record<string, Record<string, string>>;

type Props = {
  items: NavItemData[];
  lang: string;
  languages: string[];
  languageAlternates: LanguageAlternates;
  brand: string;
  phone: string | null;
  address: { street?: string; postalCode?: string; city?: string } | null;
};

export function SiteNav({
  items,
  lang,
  languages,
  languageAlternates,
  brand,
  phone,
  address,
}: Props) {
  const pathname = usePathname();
  const drawerId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const t = getDictionary(lang);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const closeOnLinkClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) {
      setOpen(false);
    }
  };

  const alternates = languageAlternates[pathname.replace(/\/$/, "")] ?? {};

  return (
    <>
      <header className={styles.header} data-open={open || undefined}>
        <div className={styles.bar}>
          <Link href={`/${lang}`} className={styles.brand} onClick={() => setOpen(false)}>
            {brand}
          </Link>

          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={drawerId}
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className={styles.menuIcon} aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <div
        className={styles.backdrop}
        data-open={open || undefined}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <div
        id={drawerId}
        className={styles.drawer}
        data-open={open || undefined}
        inert={!open}
        onClick={closeOnLinkClick}
      >
        <div className={styles.drawerInner}>
          <nav aria-label={t.mainNavigation}>
            <NavItems items={items} pathname={pathname} depth={1} />
          </nav>

          <aside className={styles.info}>
            {address?.street && (
              <p className={styles.infoText}>
                {address.street}
                <br />
                {[address.postalCode, address.city].filter(Boolean).join(" ")}
              </p>
            )}

            {phone && (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className={styles.cta}>
                <span>{t.reserveTable}</span>
                <span className={styles.ctaPhone}>{phone}</span>
              </a>
            )}

            {languages.length > 1 && (
              <div className={styles.languages} aria-label={t.language} role="group">
                {languages.map((language) => (
                  <Link
                    key={language}
                    href={alternates[language] ?? `/${language}`}
                    hrefLang={language}
                    lang={language}
                    className={styles.language}
                    aria-current={language === lang ? "true" : undefined}
                  >
                    {language.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

function NavItems({
  items,
  pathname,
  depth,
}: {
  items: NavItemData[];
  pathname: string;
  depth: number;
}) {
  return (
    <ul className={depth === 1 ? styles.list : styles.subList}>
      {items.map((item) => {
        const href = resolveNavHref(item.link as NavTargetInput);
        const active = isNavHrefActive(pathname, href);
        const className = depth === 1 ? styles.link : styles.subLink;
        const children = item.children ?? [];

        let label;
        if (!href) {
          label = <span className={styles.groupLabel}>{item.label}</span>;
        } else if (item.link?.type === "external") {
          label = (
            <a
              href={href}
              className={className}
              {...(item.link.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {item.label}
            </a>
          );
        } else {
          label = (
            <Link
              href={href}
              className={className}
              aria-current={active ? "page" : undefined}
              {...(item.link?.openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <li key={item._key} className={styles.item}>
            {label}
            {children.length > 0 && (
              <NavItems items={children} pathname={pathname} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
