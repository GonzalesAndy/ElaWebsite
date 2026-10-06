import Logo from "./Logo";
import { localeLabels, locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type Props = { footer: Dictionary["footer"]; nav: Dictionary["nav"]; locale: Locale };

export default function Footer({ footer, nav, locale }: Props) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo className="logo--large" />
          <p className="footer-tagline">{footer.tagline}</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#about">{nav.about}</a>
          <a href="#programs">{nav.programs}</a>
          <a href="#stories">{nav.testimonials}</a>
          <a href="#contact">{nav.contact}</a>
        </nav>
        <ul className="footer-langs" aria-label={nav.language}>
          {locales.map((l) => (
            <li key={l}>
              <a href={`/${l}`} hrefLang={l} lang={l} aria-current={l === locale ? "true" : undefined}>
                {localeLabels[l]}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Elena Repka. {footer.rights}
        </p>
        <p>
          <a href="#">{footer.privacy}</a> · <a href="#">{footer.imprint}</a>
        </p>
      </div>
    </footer>
  );
}
