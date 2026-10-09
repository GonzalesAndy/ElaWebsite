import Rich from "./Rich";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { withBase } from "@/lib/basePath";

type Props = {
  cta: Dictionary["pageCta"];
  locale: Locale;
  /** Overrides the default button label (e.g. "Ask about the next pilgrimage"). */
  button?: string;
  note?: string;
};

/** Closing invitation at the end of an inner page, leading to the contact form. */
export default function PageCta({ cta, locale, button, note }: Props) {
  return (
    <section className="section page-cta" aria-labelledby="page-cta-title">
      <div className="container page-cta-inner">
        <p className="eyebrow eyebrow--center" data-reveal>
          {cta.eyebrow}
        </p>
        <h2 id="page-cta-title" className="h2" data-reveal>
          <Rich text={cta.title} />
        </h2>
        {note && (
          <p className="page-cta-note" data-reveal>
            {note}
          </p>
        )}
        <p data-reveal>
          <a href={withBase(`/${locale}/#contact`)} className="btn btn--primary">
            {button ?? cta.button}
          </a>
        </p>
      </div>
    </section>
  );
}
