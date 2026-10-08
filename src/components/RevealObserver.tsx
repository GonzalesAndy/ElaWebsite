"use client";

import { useEffect } from "react";

/**
 * Fades in every [data-reveal] element as it scrolls into view.
 * Also picks up elements added after the first render (e.g. while editing with hot reload).
 */
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

    const watch = (scope: ParentNode) =>
      scope.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => observer.observe(el));
    watch(document);

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not(.is-visible)")) observer.observe(node);
          watch(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
