import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { pageMetadata } from "@/lib/seo";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import PlacesMosaic from "@/components/PlacesMosaic";
import Divider from "@/components/Divider";
import Rich from "@/components/Rich";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { journeyPage } = await getDictionary(locale);
  return pageMetadata(locale, "/journey/", journeyPage.meta);
}

export default async function JourneyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const page = dict.journeyPage;

  return (
    <PageShell dict={dict} locale={locale} path="/journey/">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        aside={
          <div className="about-visual" data-reveal>
            <span className="about-arch" aria-hidden="true" />
            <span className="about-branch" aria-hidden="true" />
            <div className="portrait" role="img" aria-label="Portrait of Elena Repka" />
          </div>
        }
      />

      <section className="places-section" aria-label={page.eyebrow}>
        <div className="container places-wrap">
          <PlacesMosaic places={page.places} />
          <p className="places-closing" data-reveal>
            <Rich text={page.closing} />
          </p>
        </div>
      </section>

      <Divider />

      <section className="section" aria-labelledby="approach-title">
        <div className="container split-text">
          <h2 id="approach-title" className="h2" data-reveal>
            <Rich text={page.approach.title} />
          </h2>
          <div className="split-text-body">
            {page.approach.paragraphs.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "lead" : undefined} data-reveal>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section offerings" aria-labelledby="offerings-title">
        <div className="container">
          <h2 id="offerings-title" className="h2 offerings-title" data-reveal>
            <Rich text={page.offerings.title} />
          </h2>
          <ul className="ledger">
            {page.offerings.groups.map((group, i) => (
              // Anchors for the "Learn more" links in the home page offers
              <li key={group.name} id={`offering-${i + 1}`} className="ledger-row" data-reveal>
                <h3 className="ledger-name">{group.name}</h3>
                {group.items ? (
                  <ul className="ledger-items">
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <h4 className="ledger-item-name">{item.name}</h4>
                        <p>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ledger-text">{group.text}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="education-title">
        <div className="container">
          <h2 id="education-title" className="h2 offerings-title" data-reveal>
            <Rich text={page.education.title} />
          </h2>
          <ul className="training-grid">
            {page.education.groups.map((group, i) => (
              <li key={group.name} className="training" data-reveal style={{ "--i": i % 3 } as React.CSSProperties}>
                <h3 className="training-name">{group.name}</h3>
                <ul className="plain-list plain-list--yes">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Divider />

      <section className="section" aria-labelledby="background-title">
        <div className="container split-text">
          <h2 id="background-title" className="h2" data-reveal>
            <Rich text={page.background.title} />
          </h2>
          <div className="split-text-body">
            {page.background.paragraphs.map((paragraph, i) => (
              <p key={i} data-reveal>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <PageCta cta={dict.pageCta} locale={locale} />
    </PageShell>
  );
}
