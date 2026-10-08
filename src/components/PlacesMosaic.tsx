"use client";

import { useEffect, useRef, useState } from "react";
import Photo from "./Photo";

type Place = { place: string; line: string };

/*
 * One photo per place, same order as the copy. `focus` keeps the subject in frame when the
 * photo is cropped to its tile (x% y%). Files live in /public/images/journey/.
 */
const photos: { src: string; focus: string }[] = [
  { src: "/images/journey/01-slovakia.webp", focus: "35% 45%" }, // Bratislava castle
  { src: "/images/journey/02-west-sumatra.webp", focus: "40% 50%" }, // rumah gadang
  { src: "/images/journey/03-tamil-nadu.webp", focus: "50% 30%" }, // Bharatanatyam
  { src: "/images/journey/04-himalaya-meditation.webp", focus: "35% 60%" }, // Elena meditating in the mountains
  { src: "/images/journey/05-provence.webp", focus: "40% 45%" }, // sunset under the rock
  { src: "/images/journey/06-assisi.webp", focus: "42% 35%" }, // Elena at the fountain
  { src: "/images/journey/07-sampor.webp", focus: "35% 40%" }, // Benedictine abbey
  { src: "/images/journey/08-vienna.webp", focus: "45% 55%" }, // Elena by the painted door
];

/**
 * Her journey as a mosaic of places. When the mosaic scrolls into view the tiles unveil one by one
 * like a curtain, the photos drift gently (parallax), and on hover the place's line slides up.
 */
export default function PlacesMosaic({ places }: { places: Place[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Reveal the whole mosaic once, when it comes into view; the tiles then open one after another
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // Gentle parallax: each photo shifts a little against its tile as the page scrolls
  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tiles = [...list.querySelectorAll<HTMLElement>(".place")];
    let frame = 0;
    const update = () => {
      const vh = window.innerHeight;
      for (const tile of tiles) {
        const box = tile.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) continue;
        // -1 when the tile enters at the bottom, +1 when it leaves at the top
        const progress = (vh / 2 - (box.top + box.height / 2)) / (vh / 2 + box.height / 2);
        tile.style.setProperty("--shift", progress.toFixed(3));
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ul className={`places ${revealed ? "is-revealed" : ""}`} ref={ref}>
      {places.map((item, i) => (
        <li
          key={item.place}
          className={`place place--${i + 1}`}
          tabIndex={0}
          style={{ "--i": i } as React.CSSProperties}
        >
          <div className="place-inner">
            <div className="place-photo" aria-hidden="true">
              <Photo src={photos[i]?.src} focus={photos[i]?.focus} sizes="(max-width: 960px) 100vw, 50vw" />
            </div>
            <div className="place-caption">
              <span className="place-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="place-name">{item.place}</h2>
              <p className="place-line">{item.line}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
