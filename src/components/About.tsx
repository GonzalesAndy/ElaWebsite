import Rich from "./Rich";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { withBase } from "@/lib/basePath";

export default function About({ about, locale }: { about: Dictionary["about"]; locale: Locale }) {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-visual" data-reveal>
          <span className="about-arch" aria-hidden="true" />
          <span className="about-branch" aria-hidden="true" />
          <div className="portrait" role="img" aria-label="Portrait of Elena Repka" />
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
          <p className="about-more" data-reveal>
            <a href={withBase(`/${locale}/journey/`)} className="text-link">
              {about.more}
              <span aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
