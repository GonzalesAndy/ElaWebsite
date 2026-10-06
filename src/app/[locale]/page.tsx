import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Programs from "@/components/Programs";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <a className="skip-link" href="#main">
        {dict.nav.skip}
      </a>
      <Header nav={dict.nav} locale={locale} />
      <main id="main">
        <Hero hero={dict.hero} />
        <About about={dict.about} />
        <Programs programs={dict.programs} />
        <Testimonials testimonials={dict.testimonials} />
        <Contact contact={dict.contact} />
      </main>
      <Footer footer={dict.footer} nav={dict.nav} locale={locale} />
      <RevealObserver />
    </>
  );
}
