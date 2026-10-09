"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Flag from "./Flag";
import MorphMenu from "./MorphMenu";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { withBase } from "@/lib/basePath";

type Props = {
  nav: Dictionary["nav"];
  locale: Locale;
  /** True on the landing page, where the header floats over the hero video until you scroll. */
  overlay?: boolean;
};

export default function Header({ nav, locale, overlay = false }: Props) {
  const [solid, setSolid] = useState(!overlay);
  const pathname = usePathname();
  // The current page without its locale, so switching language keeps you on the same page
  const subpath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
  const home = withBase(`/${locale}/`); // trailing slash: pages are exported as folder/index.html

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const links = [
    { href: `${home}#about`, label: nav.about },
    { href: `${home}#the-way`, label: nav.way },
    { href: `${home}#offers`, label: nav.offers },
    { href: `${home}pilgrimage/`, label: nav.pilgrimage },
    { href: `${home}journey/`, label: nav.journey },
    { href: `${home}#contact`, label: nav.contact },
  ];

  return (
    <header className={`site-header ${solid ? "is-solid" : ""} ${overlay ? "" : "site-header--page"}`}>
      <div className="header-side">
        <MorphMenu
          align="start"
          label={nav.menu}
          closedWidth="6.75rem"
          openWidth="15rem"
          trigger={
            <>
              <span>{nav.menu}</span>
              <span className="morph-dots" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </>
          }
        >
          {(close) => (
            <nav aria-label={nav.menu}>
              <ul className="morph-list">
                {links.map((link, i) => (
                  <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
                    <a href={link.href} onClick={close}>
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="show-sm" style={{ "--i": links.length } as React.CSSProperties}>
                  <a href={`${home}#contact`} className="morph-accent" onClick={close}>
                    {nav.book} <span aria-hidden="true">+</span>
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </MorphMenu>
      </div>

      <a href={overlay ? "#top" : home} className="header-logo" aria-label="Aurea">
        <Logo />
      </a>

      <div className="header-side header-side--end">
        <MorphMenu
          align="end"
          label={`${nav.language}: ${localeLabels[locale]}`}
          closedWidth="2.75rem"
          openWidth="12.5rem"
          trigger={
            <>
              <span className="morph-label">{nav.language}</span>
              <span className="morph-flag">
                <Flag locale={locale} />
              </span>
            </>
          }
        >
          {() => (
            <ul className="morph-list">
              {locales.map((l, i) => (
                <li key={l} style={{ "--i": i } as React.CSSProperties}>
                  <a href={withBase(`/${l}${subpath}`)} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}>
                    <Flag locale={l} />
                    {localeLabels[l]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </MorphMenu>
        <a href={`${home}#contact`} className="pill pill--accent hide-sm">
          {nav.book}
          <span aria-hidden="true">+</span>
        </a>
      </div>
    </header>
  );
}
