import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { languageAlternates, pages, pageUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** /sitemap.xml: every page in every language, each listing its translations. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((path) =>
    locales.map((locale) => ({
      url: pageUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
