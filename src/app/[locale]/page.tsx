import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Way from "@/components/Way";
import Offers from "@/components/Offers";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Divider from "@/components/Divider";
import { pageUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

/** Structured data for search engines: who Elena is and what the site offers. */
function jsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: locales,
        publisher: { "@id": `${SITE_URL}/#elena` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#elena`,
        name: "Elena Repka",
        url: SITE_URL,
        image: `${SITE_URL}/images/portrait.jpg`,
        jobTitle: "Coach",
        address: { "@type": "PostalAddress", addressLocality: "Vienna", addressCountry: "AT" },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#aurea`,
        name: SITE_NAME,
        url: pageUrl(locale, "/"),
        description,
        image: `${SITE_URL}/og.jpg`,
        founder: { "@id": `${SITE_URL}/#elena` },
        areaServed: ["AT", "DE", "SK", "IT"],
        address: { "@type": "PostalAddress", addressLocality: "Vienna", addressCountry: "AT" },
      },
    ],
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <PageShell dict={dict} locale={locale} path="/" overlayHeader>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(locale, dict.meta.description)) }}
      />
      <Hero hero={dict.hero} />
      <About about={dict.about} locale={locale} />
      <Divider />
      <Way way={dict.way} />
      <Offers offers={dict.offers} locale={locale} />
      <Divider />
      <Testimonials testimonials={dict.testimonials} />
      <Contact contact={dict.contact} locale={locale} />
    </PageShell>
  );
}
