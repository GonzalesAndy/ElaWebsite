import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Way from "@/components/Way";
import Offers from "@/components/Offers";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Divider from "@/components/Divider";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <PageShell dict={dict} locale={locale} path="/" overlayHeader>
      <Hero hero={dict.hero} />
      <About about={dict.about} locale={locale} />
      <Divider />
      <Way way={dict.way} />
      <Offers offers={dict.offers} locale={locale} />
      <Divider />
      <Testimonials testimonials={dict.testimonials} />
      <Contact contact={dict.contact} />
    </PageShell>
  );
}
