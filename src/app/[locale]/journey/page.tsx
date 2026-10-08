import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import Divider from "@/components/Divider";
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

      <section className="section story-section" aria-label={page.eyebrow}>
        <div className="container story-wrap">
          <ol className="story">
            {page.chapters.map((chapter, i) => (
              <li key={chapter.title} className="story-chapter" data-reveal>
                <span className="story-marker" aria-hidden="true" />
                <h2 className="story-title">{chapter.title}</h2>
                <p className="story-text">{chapter.text}</p>
                {i === page.chapters.length - 1 && (
                  <p className="story-links">
                    <a href={`/${locale}#the-way`} className="text-link">
                      {dict.nav.way} <span aria-hidden="true">→</span>
                    </a>
                    <a href={`/${locale}/pilgrimage`} className="text-link">
                      {dict.nav.pilgrimage} <span aria-hidden="true">→</span>
                    </a>
                    <a href={`/${locale}/research`} className="text-link">
                      {dict.nav.research} <span aria-hidden="true">→</span>
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ol>

          <p className="story-closing" data-reveal>
            <Rich text={page.closing} />
          </p>
        </div>
      </section>

      <Divider />
      <PageCta cta={dict.pageCta} locale={locale} />
    </PageShell>
  );
}
