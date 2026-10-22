import { withBase } from "@/lib/basePath";
import { addressMissing, owner } from "./owner";

/** Address lines, or a visible placeholder while owner.address is empty. */
export function Address() {
  if (addressMissing) return <p className="legal-missing">[Anschrift folgt / address to follow]</p>;
  return (
    <p>
      {owner.address.map((line) => (
        <span key={line}>
          {line}
          <br />
        </span>
      ))}
    </p>
  );
}

function Email() {
  return <a href={`mailto:${owner.email}`}>{owner.email}</a>;
}

/** Impressum: § 5 ECG, § 14 UGB and § 25 MedienG (Austria), § 5 DDG and § 18 MStV (Germany). */
export function ImprintDe() {
  return (
    <>
      <h2>Angaben gemäß § 5 ECG, § 25 MedienG (Österreich) und § 5 DDG (Deutschland)</h2>
      <p>
        <strong>{owner.name}</strong>
      </p>
      <Address />
      <p>
        E-Mail: <Email />
        <br />
        Kontaktformular: auf der Startseite
      </p>

      <h3>Unternehmensgegenstand</h3>
      <p>Coaching und Begleitung für Frauen; Informationen über Pilgerwege und Forschung.</p>

      {owner.trade && (
        <p>
          Gewerbe: {owner.trade}
          {owner.authority && (
            <>
              <br />
              Gewerbebehörde: {owner.authority}
            </>
          )}
          {owner.chamber && (
            <>
              <br />
              Kammerzugehörigkeit: {owner.chamber}
            </>
          )}
          <br />
          Anwendbare Rechtsvorschriften: Gewerbeordnung (www.ris.bka.gv.at)
        </p>
      )}
      {owner.vatId && <p>UID-Nummer: {owner.vatId}</p>}

      <h3>Offenlegung gemäß § 25 MedienG</h3>
      <p>
        Medieninhaberin: {owner.name}
        <br />
        Grundlegende Richtung: Information über das Coaching- und Pilgerangebot von {owner.name} sowie
        über ihre Forschung.
      </p>

      <h3>Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV</h3>
      <p>{owner.name}, Anschrift wie oben.</p>

      <h3>Haftung für Links</h3>
      <p>
        Für die Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich. Bei
        Bekanntwerden von Rechtsverletzungen werden solche Links umgehend entfernt.
      </p>

      <h3>Urheberrecht</h3>
      <p>
        Texte, Fotos und Grafiken dieser Website sind urheberrechtlich geschützt. Eine Verwendung ist nur
        mit vorheriger Zustimmung erlaubt.
      </p>
    </>
  );
}

export function ImprintEn() {
  return (
    <>
      <p className="legal-note">
        Information required by Austrian law (§ 5 ECG, § 25 MedienG) and German law (§ 5 DDG). The{" "}
        <a href={withBase("/de/imprint/")}>German version</a> is legally binding.
      </p>
      <h2>Site owner</h2>
      <p>
        <strong>{owner.name}</strong>
      </p>
      <Address />
      <p>
        Email: <Email />
        <br />
        Contact form: on the home page
      </p>

      <h3>Business</h3>
      <p>Coaching and guidance for women; information about pilgrimages and research.</p>

      {owner.trade && (
        <p>
          Trade: {owner.trade}
          {owner.authority && (
            <>
              <br />
              Supervisory authority: {owner.authority}
            </>
          )}
          {owner.chamber && (
            <>
              <br />
              Chamber membership: {owner.chamber}
            </>
          )}
          <br />
          Applicable rules: Austrian Trade Regulation Act (Gewerbeordnung, www.ris.bka.gv.at)
        </p>
      )}
      {owner.vatId && <p>VAT number: {owner.vatId}</p>}

      <h3>Disclosure under § 25 MedienG</h3>
      <p>
        Media owner: {owner.name}
        <br />
        Purpose of this website: information about {owner.name}&rsquo;s coaching and pilgrimage offers
        and her research.
      </p>

      <h3>Responsible for content (§ 18 (2) MStV)</h3>
      <p>{owner.name}, address as above.</p>

      <h3>Links</h3>
      <p>
        The operators of linked external websites are solely responsible for their content. Links will be
        removed promptly if any infringement becomes known.
      </p>

      <h3>Copyright</h3>
      <p>
        The texts, photos and graphics on this website are protected by copyright. Please ask before
        using them.
      </p>
    </>
  );
}
