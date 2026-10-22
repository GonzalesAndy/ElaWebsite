/**
 * Facts for the Impressum and the privacy policy. Keep them current: Austrian and German law
 * require them to be correct and complete.
 *
 * The optional fields stay hidden while empty. Fill them in once Elena registers her business
 * (trade licence, VAT number, chamber membership).
 */
export const owner = {
  name: "Elena Repka",
  /** Postal address where she can be reached (street, postcode + city, country). No P.O. box. */
  address: [] as string[],
  email: "hello@elarepka.com",

  /** Gewerbe / trade, e.g. "Lebens- und Sozialberatung". */
  trade: "",
  /** Gewerbebehörde, e.g. "Magistratisches Bezirksamt für den 7. Bezirk, Wien". */
  authority: "",
  /** e.g. "Wirtschaftskammer Wien". */
  chamber: "",
  /** UID number, e.g. "ATU12345678". */
  vatId: "",

  /** Set to true after turning on Cloudflare Web Analytics; adds it to the privacy policy. */
  analytics: false,

  /** Date of the current privacy policy. */
  updated: { de: "Oktober 2026", en: "October 2026" },
};

export const addressMissing = owner.address.length === 0;
