"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { KEY_STORAGE } from "./store";

const ReviewMode = dynamic(() => import("./ReviewMode"), { ssr: false });

/**
 * Turns on review mode for whoever opens the site with ?review=<key> (remembered in this browser;
 * ?review=off turns it off again). Regular visitors never download the review code.
 */
export default function ReviewLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const url = new URL(location.href);
      const param = url.searchParams.get("review");
      if (param === "off") localStorage.removeItem(KEY_STORAGE);
      else if (param) localStorage.setItem(KEY_STORAGE, param);
      if (param !== null) {
        url.searchParams.delete("review");
        history.replaceState(history.state, "", url);
      }
      setEnabled(Boolean(localStorage.getItem(KEY_STORAGE)));
    } catch {
      // storage blocked: review mode stays off
    }
  }, []);

  return enabled ? <ReviewMode /> : null;
}
