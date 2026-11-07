import Rich from "./Rich";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { withBase } from "@/lib/basePath";

/* The photo in the arch. null shows the portrait from globals.css (.portrait). */
const photo: string | null = "/images/spoleto-room.webp"; // the room in Spoleto

/** Ecology of Clarity: what Ela offers, with the promise in a soft bubble. The story behind it is on the journey page. */
export default function About({ about, locale }: { about: Dictionary["about"]; locale: Locale }) {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-visual" data-reveal>
          <span className="about-arch" aria-hidden="true" />
          <span className="about-branch" aria-hidden="true" />
          <div
            className="portrait"
            aria-hidden="true"
            style={photo ? { backgroundImage: `url("${withBase(photo)}")` } : undefined}
          />
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
          <div className="clarity-bubble" data-reveal>
            <p className="clarity-bubble-title">
              <Rich text={about.bubbleTitle} />
            </p>
            {about.bubble.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
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
