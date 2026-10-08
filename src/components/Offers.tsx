import Rich from "./Rich";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

/** Three quiet columns: the ways to work with Elena. */
export default function Offers({ offers, locale }: { offers: Dictionary["offers"]; locale: Locale }) {
  return (
    <section id="offers" className="section offers" aria-labelledby="offers-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            {offers.eyebrow}
          </p>
          <h2 id="offers-title" className="h2" data-reveal>
            <Rich text={offers.title} />
          </h2>
        </div>

        <ul className="offer-list">
          {offers.items.map((offer, i) => (
            <li key={offer.name} className="offer" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <h3 className="offer-name">{offer.name}</h3>
              <p className="offer-line">{offer.line}</p>
              <a href={offer.href.startsWith("#") ? offer.href : `/${locale}${offer.href}`} className="text-link">
                {offer.link}
                <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
