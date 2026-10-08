import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import Divider from "@/components/Divider";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { researchPage } = await getDictionary(locale);
  return { title: researchPage.meta.title, description: researchPage.meta.description };
}

/** A sober, typographic page: research questions, fieldwork, themes. */
export default async function ResearchPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const page = dict.researchPage;

  return (
    <PageShell dict={dict} locale={locale} path="/research">
      <PageHero eyebrow={page.eyebrow} title={page.title} subtitle={page.subtitle} intro={page.intro} />

      <section className="section research-questions" aria-labelledby="questions-title">
        <div className="container research-narrow">
          <h2 id="questions-title" className="list-title" data-reveal>
            {page.questionsTitle}
          </h2>
          <ol className="question-list">
            {page.questions.map((question, i) => (
              <li key={question} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="question-num" aria-hidden="true">
                  {["I", "II", "III", "IV", "V"][i]}
                </span>
                <p>{question}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Divider />

      <section className="section" aria-label={page.fieldTitle}>
        <div className="container research-columns">
          <div data-reveal>
            <h2 className="list-title">{page.fieldTitle}</h2>
            <p>{page.field}</p>
          </div>
          <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <h2 className="list-title">{page.comparativeTitle}</h2>
            <p>{page.comparative}</p>
          </div>
        </div>

        <div className="container research-narrow research-themes">
          <h2 className="list-title" data-reveal>
            {page.themesTitle}
          </h2>
          <ul className="tag-list" data-reveal>
            {page.themes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
          <p className="research-note" data-reveal>
            {page.positionality}
          </p>
        </div>
      </section>

      <Divider />
      <PageCta
        cta={{ ...dict.pageCta, title: page.contactTitle }}
        locale={locale}
        button={page.contactButton}
        note={page.contactText}
      />
    </PageShell>
  );
}
