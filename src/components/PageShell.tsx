import Header from "./Header";
import Footer from "./Footer";
import RevealObserver from "./RevealObserver";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

type Props = {
  dict: Dictionary;
  locale: Locale;
  /** The page without its locale, e.g. "" for home or "/journey". */
  path: string;
  /** Landing page only: the header floats over the hero video. */
  overlayHeader?: boolean;
  children: React.ReactNode;
};

/** Header, main content, footer and scroll reveals: shared by every page. */
export default function PageShell({ dict, locale, path, overlayHeader, children }: Props) {
  return (
    <>
      <a className="skip-link" href="#main">
        {dict.nav.skip}
      </a>
      <Header nav={dict.nav} locale={locale} overlay={overlayHeader} />
      <main id="main" className={overlayHeader ? undefined : "page-main"}>
        {children}
      </main>
      <Footer footer={dict.footer} nav={dict.nav} locale={locale} path={path} />
      <RevealObserver />
    </>
  );
}
