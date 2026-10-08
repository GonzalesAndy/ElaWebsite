import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import PlacesMosaic from "@/components/PlacesMosaic";
import Rich from "@/components/Rich";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { journeyPage } = await getDictionary(locale);
  return { title: journeyPage.meta.title, description: journeyPage.meta.description };
}

export default async function JourneyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const page = dict.journeyPage;

  return (
    <PageShell dict={dict} locale={locale} path="/journey">
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

      <PageCta cta={dict.pageCta} locale={locale} />
    </PageShell>
  );
}
