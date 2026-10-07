"use client";

import { useState } from "react";
import Image from "next/image";
import Rich from "./Rich";
import type { Dictionary } from "@/i18n/getDictionary";

/* One photo per chapter, shown whole (3:2, like the photos themselves). */
const photos = [
  "/images/programs/program-1.webp", // hands, coffee & journal
  "/images/programs/program-2.webp", // olive groves & hills
  "/images/programs/program-3.webp", // woman walking in the field
];

/**
 * Heading and the active chapter's photo side by side, the journey across the full width below.
 * The photo follows the chapter the visitor hovers or taps. All text stays visible; there is no timer.
 */
export default function Programs({ programs }: { programs: Dictionary["programs"] }) {
  const [active, setActive] = useState(0);

  return (
    <section id="programs" className="section programs" aria-labelledby="programs-title">
      <div className="container programs-layout">
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

        <div className="programs-photo" data-reveal aria-hidden="true">
          {photos.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="(max-width: 960px) 100vw, 55vw"
              className={i === active ? "is-active" : ""}
            />
          ))}
        </div>

        <ol className="journey" data-reveal>
          {programs.items.map((item, i) => (
            <li
              key={item.name}
              className={`journey-step ${i === active ? "is-active" : ""}`}
              style={{ "--i": i } as React.CSSProperties}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
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
