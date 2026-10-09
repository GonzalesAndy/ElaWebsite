import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import Divider from "@/components/Divider";
import Photo from "@/components/Photo";
import Route from "@/components/Route";
import TownCarousel from "@/components/TownCarousel";
import Rich from "@/components/Rich";

/* Photos for this page (in /public/images/pilgrimage/). The towns follow the order of the route. */
const townPhotos = [
  "/images/pilgrimage/1-assisi.webp",
  "/images/pilgrimage/2-spello.webp",
  "/images/pilgrimage/3-foligno.webp",
  "/images/pilgrimage/4-trevi.webp",
  "/images/pilgrimage/5-campello.webp",
  "/images/pilgrimage/6-spoleto.webp",
];
const roadPhoto: string | null = "/images/pilgrimage/st-francis.webp"; // St Francis: the pilgrimage follows his footsteps

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { pilgrimagePage } = await getDictionary(locale);
  return { title: pilgrimagePage.meta.title, description: pilgrimagePage.meta.description };
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

      <section className="section" aria-labelledby="is-title">
        <div className="container is-not-grid">
          <div data-reveal>
            <h2 id="is-title" className="list-title">
              {page.isTitle}
            </h2>
            <ul className="plain-list plain-list--yes">
              {page.is.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <h2 className="list-title">{page.notTitle}</h2>
            <ul className="plain-list plain-list--no">
              {page.not.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Divider />

      <section className="section route-section" aria-labelledby="route-title">
        <div className="container">
          <div className="section-head">
            <h2 id="route-title" className="h2" data-reveal>
              {page.routeTitle}
            </h2>
            <p className="section-intro" data-reveal>
              {page.routeIntro}
            </p>
          </div>
          <Route stops={page.stops} label={page.routeTitle} />
        </div>
      </section>

      <section className="section road-section" aria-labelledby="road-title">
        <div className="container road-grid">
          <div className="road-photo" data-reveal aria-hidden="true">
            <Photo src={roadPhoto} sizes="(max-width: 960px) 100vw, 45vw" />
          </div>
          <div>
            <h2 id="road-title" className="h2" data-reveal>
              {page.roadTitle}
            </h2>
            <p className="road-text" data-reveal>
              {page.road}
            </p>
            <h2 className="h2 road-return-title" data-reveal>
              {page.returnTitle}
            </h2>
            <p className="lead" data-reveal>
              <Rich text={page.returnText} />
            </p>
          </div>
        </div>
      </section>

      <Divider />
      <PageCta cta={dict.pageCta} locale={locale} button={page.cta} note={page.dates} />
    </PageShell>
  );
}
