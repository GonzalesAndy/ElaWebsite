import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/** The public address of the site: canonical URLs, sitemap, social cards. */
export const SITE_URL = "https://elarepka.com";
export const SITE_NAME = "Aurea · Elena Repka";

/** Every page of the site, without its locale (also the sitemap's list). */
export const pages = ["/", "/journey/", "/pilgrimage/", "/research/"] as const;
export type PagePath = (typeof pages)[number];

const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  de: "de_AT",
  sk: "sk_SK",
  it: "it_IT",
};

export function pageUrl(locale: Locale, path: PagePath) {
  return `${SITE_URL}/${locale}${path}`;
}

/** The same page in every language, plus x-default (English) for everyone else. */
export function languageAlternates(path: PagePath) {
  return {
    ...Object.fromEntries(locales.map((l) => [l, pageUrl(l, path)])),
    "x-default": pageUrl(defaultLocale, path),
  };
}

/** Title, description, canonical, hreflang and social-card tags for one page in one language. */
export function pageMetadata(
  locale: Locale,
  path: PagePath,
  meta: { title: string; description: string },
): Metadata {
  const url = pageUrl(locale, path);
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.jpg"],
    },
  };
}
