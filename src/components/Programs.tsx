import Rich from "./Rich";
import type { Dictionary } from "@/i18n/getDictionary";

/** The three programs as one journey: a line with a marker per step, ending in a single call to action. */
export default function Programs({ programs }: { programs: Dictionary["programs"] }) {
  return (
    <section id="programs" className="section programs" aria-labelledby="programs-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            {programs.eyebrow}
          </p>
          <h2 id="programs-title" className="h2" data-reveal>
            <Rich text={programs.title} />
          </h2>
          <p className="section-intro" data-reveal>
            {programs.intro}
          </p>
        </div>

        <ol className="journey" data-reveal>
          {programs.items.map((item, i) => (
            <li key={item.name} className="journey-step" style={{ "--i": i } as React.CSSProperties}>
              <span className="journey-marker" aria-hidden="true" />
              <h3 className="journey-name">{item.name}</h3>
              <p className="journey-line">{item.line}</p>
            </li>
          ))}
        </ol>

        <div className="journey-cta" data-reveal>
          <a href="#contact" className="btn btn--primary">
            {programs.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
