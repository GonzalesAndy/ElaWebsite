import Rich from "./Rich";
import type { Dictionary } from "@/i18n/getDictionary";

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

        <ul className="program-grid">
          {programs.items.map((item, i) => (
            <li
              key={item.name}
              className={`program-card ${i === 1 ? "program-card--featured" : ""}`}
              data-reveal
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="program-top">
                <span className="program-num">0{i + 1}</span>
                <span className="program-duration">{item.tag}</span>
              </div>
              <h3 className="program-name">{item.name}</h3>
              <p className="program-desc">{item.description}</p>
              <ul className="program-points">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a href="#contact" className="program-link">
                {programs.cta}
                <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
