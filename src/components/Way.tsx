"use client";

import { useState } from "react";
import Rich from "./Rich";
import Photo from "./Photo";
import type { Dictionary } from "@/i18n/getDictionary";

/* One photo per clearing, shown whole (3:2). Use null for a soft placeholder. */
const photos: (string | null)[] = [
  "/images/programs/program-1.webp", // Space: hands, coffee & journal
  "/images/programs/program-2.webp", // Time: olive groves & hills
  "/images/programs/relationships.webp", // Relationships: three women talking over tea
  "/images/programs/program-3.webp", // Inner life: woman walking in the field
];

/**
 * The Four Clearings as a vertical path on the left; the photo on the right follows
 * the clearing the visitor hovers or taps. All text stays visible; there is no timer.
 */
export default function Way({ way }: { way: Dictionary["way"] }) {
  const [active, setActive] = useState(0);

  return (
    <section id="the-way" className="section programs" aria-labelledby="way-title">
      <div className="container programs-layout">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            {way.eyebrow}
          </p>
          <h2 id="way-title" className="h2" data-reveal>
            <Rich text={way.title} />
          </h2>
          <p className="section-intro" data-reveal>
            <Rich text={way.intro} />
          </p>
        </div>

        <div className="programs-photo" data-reveal aria-hidden="true">
          {photos.map((src, i) => (
            <Photo
              key={i}
              src={src}
              sizes="(max-width: 960px) 100vw, 55vw"
              className={i === active ? "is-active" : ""}
            />
          ))}
        </div>

        <ol className="journey" data-reveal>
          {way.items.map((item, i) => (
            <li
              key={item.name}
              className={`journey-step ${i === active ? "is-active" : ""}`}
              style={{ "--i": i } as React.CSSProperties}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="journey-marker" aria-hidden="true" />
              <h3 className="journey-name">{item.name}</h3>
              <p className="journey-question">{item.question}</p>
              <p className="journey-line">{item.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
