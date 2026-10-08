"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const INTERVAL = 6000;

type Props = {
  /** Town names, in the order of the pilgrimage. */
  towns: string[];
  /** One photo per town, same order. */
  photos: string[];
  labels: { pause: string; play: string; show: string };
};

/**
 * The towns of the pilgrimage, one after another: slow crossfade with a gentle zoom.
 * Pauses on hover, has a pause button, and does not auto-play when reduced motion is preferred.
 */
export default function TownCarousel({ towns, photos, labels }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  // A fresh timer for every slide, so picking a town by hand always gives it the full time
  useEffect(() => {
    if (!playing || hovered) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % photos.length), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, playing, hovered, photos.length]);

  return (
    <div
      className="container wide-photo town-carousel"
      data-reveal
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(max-width: 1600px) 100vw, 1600px"
          priority={i === 0}
          loading={i === 0 ? undefined : "eager"} /* all towns ready before their turn */
          className={i === index ? "is-active" : ""}
        />
      ))}
      <div className="town-scrim" aria-hidden="true" />

      <p className="town-caption" aria-live="polite">
        <span className="town-count">
          {index + 1} / {towns.length}
        </span>
        <span className="town-name">{towns[index]}</span>
      </p>

      <div className="town-controls">
        <div className="town-dots">
          {towns.map((town, i) => (
            <button
              key={town}
              type="button"
              className={`town-dot ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`${labels.show}: ${town}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          className="video-toggle town-toggle"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? labels.pause : labels.play}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="7" y="5" width="3.5" height="14" rx="1" />
              <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
