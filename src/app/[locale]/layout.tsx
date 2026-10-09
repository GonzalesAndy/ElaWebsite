import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { withBase } from "@/lib/basePath";
import "../globals.css";

/*
 * Two font pairings, switchable for comparison:
 *   default          → Cormorant Garamond + Inter Light
 *   ?fonts=fraunces  → Fraunces + DM Sans
 * Only the default pairing is preloaded.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--ff-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--ff-fraunces",
  display: "swap",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--ff-dmsans",
  display: "swap",
  preload: false,
});

// Applies ?fonts=… before first paint so there is no flash of the other pairing.
const fontSwitch = `try{var f=new URLSearchParams(location.search).get("fonts");if(f)document.documentElement.dataset.fonts=f}catch(e){}`;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, withBase(`/${l}/`)])),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#F5EEE1",
};

export default async function LocaleLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${inter.variable} ${fraunces.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="font-switch" strategy="beforeInteractive">
          {fontSwitch}
        </Script>
        {children}
      </body>
    </html>
  );
}
