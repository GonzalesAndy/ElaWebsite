import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en.json";

export type Dictionary = typeof en;

/*
 * English is the source of truth. Other languages only contain the keys that have been
 * translated; anything missing (for example new copy waiting for review) falls back to English.
 */
const translations: Record<Exclude<Locale, "en">, () => Promise<unknown>> = {
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  sk: () => import("./dictionaries/sk.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
};

type Json = Record<string, unknown>;
const isObject = (value: unknown): value is Json =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Fills in missing keys from `base`; arrays and strings from `override` replace the base wholesale. */
function withFallback(base: Json, override: Json): Json {
  const result: Json = { ...base };
  for (const [key, value] of Object.entries(override)) {
    result[key] = isObject(value) && isObject(base[key]) ? withFallback(base[key] as Json, value) : value;
  }
  return result;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "en") return en;
  const translated = (await translations[locale]()) as Json;
  return withFallback(en as Json, translated) as Dictionary;
}
