"use client";

import { useEffect } from "react";

/** Fades in every [data-reveal] element as it scrolls into view. */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
