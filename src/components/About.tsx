import Rich from "./Rich";
import type { Dictionary } from "@/i18n/getDictionary";

export default function About({ about }: { about: Dictionary["about"] }) {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-visual" data-reveal>
          <div className="portrait" role="img" aria-label="Portrait of Elena Repka" />
          <span className="orb orb--blush" aria-hidden="true" />
          <span className="orb orb--sage" aria-hidden="true" />
        </div>

        <div className="about-text">
          <p className="eyebrow" data-reveal>
            {about.eyebrow}
          </p>
          <h2 id="about-title" className="h2" data-reveal>
            <Rich text={about.title} />
          </h2>
          <p className="lead" data-reveal>
            {about.p1}
          </p>
          <p data-reveal>
            <Rich text={about.p2} />
          </p>
          <dl className="stats" data-reveal>
            {about.stats.map((stat) => (
              <div key={stat.label} className="stat">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
