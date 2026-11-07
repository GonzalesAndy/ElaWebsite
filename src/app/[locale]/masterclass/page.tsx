import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { pageMetadata } from "@/lib/seo";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import PageCta from "@/components/PageCta";
import Divider from "@/components/Divider";
import Rich from "@/components/Rich";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { masterclassPage } = await getDictionary(locale);
  return pageMetadata(locale, "/masterclass/", masterclassPage.meta);
}

/** Four Clearings: the 4-week masterclass. The clearings' names and questions come from the home page. */
export default async function MasterclassPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const page = dict.masterclassPage;

  return (
    <PageShell dict={dict} locale={locale} path="/masterclass/">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} />

      {[page.why, page.how].map((block, b) => (
        <section key={b} className="section" aria-labelledby={`mc-text-${b}`}>
          <div className="container split-text">
            <h2 id={`mc-text-${b}`} className="h2" data-reveal>
              <Rich text={block.title} />
            </h2>
            <div className="split-text-body">
              {block.paragraphs.map((paragraph, i) => (
                <p key={i} className={b === 0 && i === 0 ? "lead" : undefined} data-reveal>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <Divider />

      <section className="section" aria-labelledby="clearings-title">
        <div className="container">
          <h2 id="clearings-title" className="h2 offerings-title" data-reveal>
            <Rich text={page.clearings.title} />
          </h2>
          <ul className="offer-list">
            {dict.way.items.map((item, i) => (
              <li key={item.name} className="offer" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <h3 className="offer-name">
                  {i + 1}. {item.name}
                </h3>
                <p className="journey-question">{item.question}</p>
                <ul className="plain-list plain-list--yes clearing-prompts">
                  {page.clearings.prompts[i].map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="receive-title">
        <div className="container split-text">
          <div data-reveal>
            <h2 id="receive-title" className="h2">
              <Rich text={page.receive.title} />
            </h2>
            <ul className="mc-facts">
              {page.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
          <ul className="plain-list plain-list--yes mc-receive" data-reveal>
            {page.receive.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <Divider />
      <PageCta
        cta={{ ...dict.pageCta, title: page.cta.title }}
        locale={locale}
        button={page.cta.button}
        note={page.cta.note}
      />
    </PageShell>
  );
}
