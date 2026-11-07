import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { pageMetadata } from "@/lib/seo";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import Divider from "@/components/Divider";
import Photo from "@/components/Photo";
import Route from "@/components/Route";
import TownCarousel from "@/components/TownCarousel";
import Rich from "@/components/Rich";

/* Photos for this page (in /public/images/pilgrimage/). The towns follow the order of the route, Spoleto to Assisi. */
const townPhotos = [
  "/images/pilgrimage/6-spoleto.webp",
  "/images/pilgrimage/5-campello.webp",
  "/images/pilgrimage/4-trevi.webp",
  "/images/pilgrimage/3-foligno.webp",
  "/images/pilgrimage/2-spello.webp",
  "/images/pilgrimage/1-assisi.webp",
];
/* Photos of Spoleto, where the retreat is based (one wide, or several in a grid). The section stays hidden while empty. */
const spoletoPhotos: string[] = ["/images/pilgrimage/spoleto-street.webp"];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { pilgrimagePage } = await getDictionary(locale);
  return pageMetadata(locale, "/pilgrimage/", pilgrimagePage.meta);
}

export default async function PilgrimagePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const page = dict.pilgrimagePage;

  return (
    <PageShell dict={dict} locale={locale} path="/pilgrimage/">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} wide />

      <TownCarousel towns={page.stops} photos={townPhotos} labels={page.carousel} />

      <section className="section" aria-labelledby="retreat-title">
        <div className="container split-text">
          <h2 id="retreat-title" className="h2" data-reveal>
            <Rich text={page.retreat.title} />
          </h2>
          <div className="split-text-body">
            {page.retreat.paragraphs.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "lead" : undefined} data-reveal>
                {paragraph}
              </p>
            ))}
            <h3 className="list-title retreat-list-title" data-reveal>
              {page.retreat.listTitle}
            </h3>
            <ul className="plain-list plain-list--yes" data-reveal>
              {page.retreat.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p data-reveal>{page.retreat.closing}</p>
          </div>
        </div>
      </section>

      <Divider />

      <section className="section route-section" aria-labelledby="route-title">
        <div className="container">
          <div className="section-head">
            <h2 id="route-title" className="h2" data-reveal>
              <Rich text={page.routeTitle} />
            </h2>
            <p className="section-intro" data-reveal>
              {page.routeIntro}
            </p>
          </div>
          <Route stops={page.stops} label={page.routeTitle.replaceAll("*", "")} />
        </div>
      </section>

      <section className="section" aria-labelledby="included-title">
        <div className="container is-not-grid">
          <div data-reveal>
            <h2 id="included-title" className="list-title">
              {page.includedTitle}
            </h2>
            <ul className="plain-list plain-list--yes">
              {page.included.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <h2 className="list-title">{page.takeTitle}</h2>
            <ul className="plain-list plain-list--yes">
              {page.take.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container">
          <p className="take-line" data-reveal>
            <Rich text={page.takeLine} />
          </p>
        </div>
      </section>

      {spoletoPhotos.length > 0 && (
        <section className="section spoleto-section" aria-labelledby="spoleto-title">
          <div className="container">
            <h2 id="spoleto-title" className="h2" data-reveal>
              {page.galleryTitle}
            </h2>
            <div className={`spoleto-gallery ${spoletoPhotos.length === 1 ? "spoleto-gallery--single" : ""}`}>
              {spoletoPhotos.map((src) => (
                <div key={src} className="wide-photo" data-reveal>
                  <Photo src={src} sizes="(max-width: 960px) 100vw, 60vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Divider />

      {/* All guided walks with dates; the home page's "Retreats & walks" links here */}
      <section id="walks" className="section" aria-labelledby="walks-title">
        <div className="container">
          <div className="section-head">
            <h2 id="walks-title" className="h2" data-reveal>
              <Rich text={page.walks.title} />
            </h2>
            <p className="section-intro" data-reveal>
              {page.walks.intro}
            </p>
          </div>
          <ul className="ledger">
            {page.walks.items.map((walk) => (
              <li key={walk.route} className="ledger-row" data-reveal>
                <h3 className="ledger-name">{walk.region}</h3>
                <div>
                  <p className="walk-route">{walk.route}</p>
                  <p className="walk-dates">{walk.dates}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PageCta cta={dict.pageCta} locale={locale} button={page.cta} note={page.dates} />
    </PageShell>
  );
}
