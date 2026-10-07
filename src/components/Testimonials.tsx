"use client";

import { useEffect, useState } from "react";
import Rich from "./Rich";
import type { Dictionary } from "@/i18n/getDictionary";

const INTERVAL = 9000;

export default function Testimonials({ testimonials }: { testimonials: Dictionary["testimonials"] }) {
  const { items } = testimonials;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (paused || interacted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, interacted, items.length]);

  const go = (next: number) => {
    setInteracted(true);
    setIndex((next + items.length) % items.length);
  };

  return (
    <section id="stories" className="section stories" aria-labelledby="stories-title">
      <div className="container stories-inner">
        <p className="eyebrow eyebrow--center" data-reveal>
          {testimonials.eyebrow}
        </p>
        <h2 id="stories-title" className="h2" data-reveal>
          <Rich text={testimonials.title} />
        </h2>

        <div
          className="quotes"
          data-reveal
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-live={interacted ? "polite" : "off"}
        >
          <span className="quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          {items.map((item, i) => (
            <figure key={item.name} className={`quote ${i === index ? "is-active" : ""}`} aria-hidden={i !== index}>
              <blockquote>
                <p>{item.quote}</p>
              </blockquote>
              <figcaption>
                <span className="quote-name">{item.name}</span>
                <span className="quote-detail">{item.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="quote-controls" data-reveal>
          <button className="round-btn" onClick={() => go(index - 1)} aria-label={testimonials.prev}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="quote-dots">
            {items.map((item, i) => (
              <button
                key={item.name}
                className={`dot ${i === index ? "is-active" : ""}`}
                onClick={() => go(i)}
                aria-label={`${item.name}, ${item.detail}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
          <button className="round-btn" onClick={() => go(index + 1)} aria-label={testimonials.next}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
