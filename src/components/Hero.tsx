"use client";

import { useEffect, useRef, useState } from "react";
import Rich from "./Rich";
import type { Dictionary } from "@/i18n/getDictionary";

export default function Hero({ hero }: { hero: Dictionary["hero"] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
      setPlaying(false);
      return;
    }

    // Gently shrink the card as the visitor scrolls away from the hero.
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const progress = Math.min(window.scrollY / window.innerHeight, 1);
        cardRef.current?.style.setProperty("--p", progress.toFixed(3));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-card" ref={cardRef}>
        <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-content">
          <p className="hero-eyebrow rise" style={{ "--i": 0 } as React.CSSProperties}>
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero-title rise" style={{ "--i": 1 } as React.CSSProperties}>
            <Rich text={hero.title} />
          </h1>
          {/* <p className="hero-subtitle rise" style={{ "--i": 2 } as React.CSSProperties}>
            {hero.subtitle}
          </p> */}
          <div className="hero-actions rise" style={{ "--i": 3 } as React.CSSProperties}>
            <a href="#contact" className="btn btn--light">
              {hero.cta}
            </a>
            <a href="#the-way" className="btn btn--glass">
              {hero.secondary}
            </a>
          </div>
        </div>

        <button
          className="video-toggle rise"
          style={{ "--i": 4 } as React.CSSProperties}
          onClick={toggleVideo}
          aria-label={playing ? "Pause background video" : "Play background video"}
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
    </section>
  );
}
