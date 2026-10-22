import { withBase } from "@/lib/basePath";
import { Address } from "./Imprint";
import { owner } from "./owner";

function Email() {
  return <a href={`mailto:${owner.email}`}>{owner.email}</a>;
}

/** Datenschutzerklärung (GDPR Art. 13). It describes what the site actually does: check it after changes. */
export function PrivacyDe() {
  return (
    <>
      <h2>Verantwortliche</h2>
      <p>
        <strong>{owner.name}</strong>
      </p>
      <Address />
      <p>
        E-Mail: <Email />
      </p>

      <h2>Kurz gesagt</h2>
      <p>
        Diese Website setzt keine Cookies, verwendet keine Analyse- oder Werbedienste und lädt keine Inhalte
        von Dritten (Schriften, Bilder und Videos liegen auf dem eigenen Server). Personenbezogene Daten
        werden nur verarbeitet, um die Website auszuliefern und um auf Nachrichten zu antworten.
      </p>

      <h2>Hosting und Server-Protokolle</h2>
      <p>
        Die Website wird über Cloudflare ausgeliefert (Cloudflare, Inc., 101 Townsend St., San Francisco,
        CA 94107, USA). Beim Aufruf verarbeitet Cloudflare technisch notwendige Daten wie IP-Adresse,
        Datum und Uhrzeit, aufgerufene Seite, Browser und Betriebssystem, um die Seite auszuliefern und vor
        Angriffen zu schützen. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und
        funktionierenden Webauftritt (Art. 6 Abs. 1 lit. f DSGVO). Mit Cloudflare besteht ein
        Auftragsverarbeitungsvertrag. Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert;
        zusätzlich gelten die EU-Standardvertragsklauseln.
      </p>

      {owner.analytics && (
        <>
          <h2>Besucherstatistik</h2>
          <p>
            Wir verwenden Cloudflare Web Analytics, um zu sehen, wie oft Seiten aufgerufen werden. Der Dienst
            setzt keine Cookies, speichert nichts auf Ihrem Gerät und erstellt keine Nutzerprofile; IP-Adressen
            werden nicht zu diesem Zweck gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </>
      )}

      <h2>Kontaktformular und E-Mail</h2>
      <p>
        Wenn Sie das Kontaktformular nutzen oder eine E-Mail schreiben, verarbeiten wir Ihren Namen, Ihre
        E-Mail-Adresse, Ihre Nachricht, Ihr Interessengebiet und die Sprache der Website, um Ihre Anfrage zu
        beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anfrage vor einem möglichen Vertrag)
        bzw. Art. 6 Abs. 1 lit. f DSGVO (Beantwortung allgemeiner Anfragen).
      </p>
      <p>
        Die Nachricht wird über Cloudflare Email Routing an das E-Mail-Postfach von {owner.name} bei
        Google (Gmail; Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) zugestellt.
        Google kann Daten in die USA übermitteln; Google ist nach dem EU-US Data Privacy Framework
        zertifiziert.
      </p>
      <p>
        Wir löschen Ihre Anfrage, sobald sie erledigt ist und kein weiterer Kontakt zu erwarten ist, es sei
        denn, gesetzliche Aufbewahrungspflichten (etwa nach § 132 BAO für Geschäftsunterlagen) verlangen eine
        längere Speicherung.
      </p>

      <h2>Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Schreiben Sie dazu einfach an <Email />.
      </p>
      <p>
        Wenn Sie meinen, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie
        sich bei einer Aufsichtsbehörde beschweren. In Österreich ist das die Datenschutzbehörde,
        Barichgasse 40–42, 1030 Wien, www.dsb.gv.at; in Deutschland die Datenschutzbehörde Ihres
        Bundeslandes.
      </p>

      <p className="legal-updated">Stand: {owner.updated.de}</p>
    </>
  );
}

export function PrivacyEn() {
  return (
    <>
      <p className="legal-note">
        Translation for convenience; the <a href={withBase("/de/privacy/")}>German version</a> is legally
        binding.
      </p>

      <h2>Controller</h2>
      <p>
        <strong>{owner.name}</strong>
      </p>
      <Address />
      <p>
        Email: <Email />
      </p>

      <h2>In short</h2>
      <p>
        This website sets no cookies, uses no analytics or advertising services and loads nothing from
        third parties (fonts, images and videos are hosted with the site). Personal data is processed only to
        deliver the website and to answer your messages.
      </p>

      <h2>Hosting and server logs</h2>
      <p>
        The website is delivered by Cloudflare (Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107,
        USA). When you visit, Cloudflare processes technically necessary data such as your IP address, date
        and time, the page requested, browser and operating system, to deliver the site and protect it from
        attacks. The legal basis is our legitimate interest in a secure, working website (Art. 6(1)(f)
        GDPR). A data processing agreement is in place with Cloudflare. Cloudflare is certified under the
        EU-US Data Privacy Framework; the EU Standard Contractual Clauses also apply.
      </p>

      {owner.analytics && (
        <>
          <h2>Visitor statistics</h2>
          <p>
            We use Cloudflare Web Analytics to see how often pages are visited. It sets no cookies, stores
            nothing on your device and builds no user profiles; IP addresses are not stored for this purpose.
            The legal basis is Art. 6(1)(f) GDPR.
          </p>
        </>
      )}

      <h2>Contact form and email</h2>
      <p>
        When you use the contact form or send an email, we process your name, email address, message, area
        of interest and the website language in order to answer you. The legal basis is Art. 6(1)(b) GDPR
        (an enquiry before a possible contract) or Art. 6(1)(f) GDPR (answering general enquiries).
      </p>
      <p>
        The message is delivered through Cloudflare Email Routing to {owner.name}&rsquo;s mailbox at Google
        (Gmail; Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland). Google may transfer
        data to the USA; Google is certified under the EU-US Data Privacy Framework.
      </p>
      <p>
        We delete your enquiry once it has been dealt with and no further contact is expected, unless legal
        retention duties (for example § 132 of the Austrian Federal Fiscal Code for business records) require
        us to keep it longer.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right of access, rectification, erasure, restriction of processing, data portability and
        objection (Art. 15–21 GDPR). Just write to <Email />.
      </p>
      <p>
        If you believe the processing of your data breaks data protection law, you can complain to a
        supervisory authority. In Austria this is the Datenschutzbehörde, Barichgasse 40–42, 1030 Vienna,
        www.dsb.gv.at; in other EU countries, the authority where you live.
      </p>

      <p className="legal-updated">Last updated: {owner.updated.en}</p>
    </>
  );
}
