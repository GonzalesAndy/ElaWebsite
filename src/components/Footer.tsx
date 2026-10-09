import Logo from "./Logo";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { withBase } from "@/lib/basePath";

type Props = {
  footer: Dictionary["footer"];
  nav: Dictionary["nav"];
  locale: Locale;
  /** The current page without its locale (e.g. "/journey/"), so language links stay on this page. */
  path?: string;
};

export default function Footer({ footer, nav, locale, path = "/" }: Props) {
  const home = withBase(`/${locale}/`); // trailing slash: pages are exported as folder/index.html

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo className="logo--large" />
          <p className="footer-tagline">{footer.tagline}</p>
        </div>
        <nav className="footer-links" aria-label={footer.explore}>
          <a href={`${home}#the-way`}>{nav.way}</a>
          <a href={`${home}#offers`}>{nav.offers}</a>
          <a href={`${home}pilgrimage/`}>{nav.pilgrimage}</a>
          <a href={`${home}journey/`}>{nav.journey}</a>
          <a href={`${home}research/`}>{nav.research}</a>
          <a href={`${home}#contact`}>{nav.contact}</a>
        </nav>
        <ul className="footer-langs" aria-label={nav.language}>
          {locales.map((l) => (
            <li key={l}>
              <a href={withBase(`/${l}${path}`)} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}>
                {localeLabels[l]}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Aurea · Elena Repka. {footer.rights}
        </p>
        <p>
          <a href="#">{footer.privacy}</a> · <a href="#">{footer.imprint}</a>
        </p>
      </div>
    </footer>
  );
}
