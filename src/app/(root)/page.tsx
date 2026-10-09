import Script from "next/script";
import { defaultLocale, locales } from "@/i18n/config";
import { BASE_PATH } from "@/lib/basePath";

/*
 * The root of the site sends visitors to their own language (falling back to English).
 * A static host can't do this on the server, so it happens in the browser.
 */
const redirect = `
  var supported = ${JSON.stringify(locales)};
  var wanted = (navigator.languages || [navigator.language || ""]).map(function (l) { return l.slice(0, 2).toLowerCase(); });
  var locale = wanted.find(function (l) { return supported.indexOf(l) !== -1; }) || "${defaultLocale}";
  location.replace("${BASE_PATH}/" + locale + "/" + location.hash);
`;

export default function RootPage() {
  return (
    <>
      <Script id="language-redirect" strategy="beforeInteractive">
        {redirect}
      </Script>
      <noscript>
        <p>
          <a href={`${BASE_PATH}/${defaultLocale}/`}>Aurea</a>
        </p>
      </noscript>
    </>
  );
}
