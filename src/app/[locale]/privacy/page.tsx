import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { SITE_URL } from "@/lib/seo";
import { PrivacyDe, PrivacyEn } from "@/legal/Privacy";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { footer } = await getDictionary(locale);
  return {
    title: `${footer.privacy} · Aurea`,
    alternates: { canonical: `${SITE_URL}/${locale}/privacy/` },
    robots: { index: false },
  };
}

/** German text on /de/, English (pointing to the binding German text) on the other languages. */
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <PageShell dict={dict} locale={locale} path="/privacy/">
      <PageHero eyebrow="Aurea · Elena Repka" title={dict.footer.privacy} />
      <section className="section legal">
        <div className="container research-narrow legal-text">{locale === "de" ? <PrivacyDe /> : <PrivacyEn />}</div>
      </section>
    </PageShell>
  );
}
