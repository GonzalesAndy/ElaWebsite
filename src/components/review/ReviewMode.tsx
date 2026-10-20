"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { locales, localeLabels } from "@/i18n/config";
import { BASE_PATH, withBase } from "@/lib/basePath";
import {
  addComment,
  deleteComment,
  isShared,
  KEY_STORAGE,
  listComments,
  setStatus,
  type ReviewComment,
} from "./store";
import "./review.css";

/** What a click in comment mode attaches to: the closest of these, else the element itself. */
const TARGETS =
  "img, video, svg, picture, [role=img], h1, h2, h3, h4, h5, h6, p, li, blockquote, figcaption, dt, dd, a, button, label, input, textarea, select";

type Draft = { el: Element; x: number; y: number; quote: string };

function pickTarget(node: EventTarget | null): Element | null {
  if (!(node instanceof Element) || node.closest("[data-review-ui]")) return null;
  return node.closest(TARGETS) ?? node;
}

/** A CSS path that finds the same element again, in every language (the markup is the same). */
function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body) {
    if (node.id) {
      parts.unshift(`#${CSS.escape(node.id)}`);
      return parts.join(" > ");
    }
    const tag = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    const same = parent ? Array.from(parent.children).filter((c) => c.tagName === node!.tagName) : [];
    parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
    node = parent;
  }
  return ["body", ...parts].join(" > ");
}

function findElement(selector: string): Element | null {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

function describe(el: Element) {
  const text =
    el.getAttribute("alt") ??
    el.getAttribute("aria-label") ??
    (el instanceof HTMLElement ? el.innerText : el.textContent) ??
    "";
  let src: string | undefined;
  if (el instanceof HTMLImageElement) src = el.currentSrc || el.src;
  else if (el instanceof HTMLVideoElement) src = el.currentSrc || el.querySelector("source")?.src;
  else {
    const bg = getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (bg) src = bg[1];
  }
  return { snippet: text.replace(/\s+/g, " ").trim().slice(0, 300), src };
}

/** The current page without base path and locale: "/en/journey/" → "/journey/". */
function currentPage() {
  const path = location.pathname.slice(BASE_PATH.length);
  return path.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function ReviewMode() {
  const [commenting, setCommenting] = useState(false);
  const [hovered, setHovered] = useState<Element | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const [flash, setFlash] = useState<Element | null>(null);
  const [, setLayoutTick] = useState(0);

  const locale = document.documentElement.lang;
  const page = currentPage();

  const refresh = useCallback(async () => {
    try {
      setComments(await listComments());
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Pins sit in page coordinates: re-measure when the layout changes.
  useEffect(() => {
    const bump = () => setLayoutTick((t) => t + 1);
    const resize = new ResizeObserver(bump);
    resize.observe(document.body);
    const timer = setInterval(bump, 1500);
    window.addEventListener("scroll", bump, { passive: true });
    return () => {
      window.removeEventListener("scroll", bump);
      resize.disconnect();
      clearInterval(timer);
    };
  }, []);

  // Comment mode: highlight on hover, open the popup on click, and keep the page's own links inert.
  useEffect(() => {
    if (!commenting || draft) return;
    const onMove = (e: PointerEvent) => setHovered(pickTarget(e.target));
    const onClick = (e: MouseEvent) => {
      const el = pickTarget(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const selection = window.getSelection();
      const quote =
        selection && !selection.isCollapsed && el.contains(selection.anchorNode)
          ? selection.toString().trim()
          : "";
      setHovered(null);
      setDraft({ el, x: e.clientX, y: e.clientY, quote });
    };
    const block = (e: Event) => {
      if (pickTarget(e.target)) e.preventDefault();
    };
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", block, true);
    return () => {
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", block, true);
      setHovered(null);
    };
  }, [commenting, draft]);

  // Keyboard: C toggles comment mode, Escape steps back.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as Element).closest?.("input, textarea, select, [contenteditable]");
      if (e.key === "Escape") {
        if (draft) setDraft(null);
        else if (commenting) setCommenting(false);
        else setPanelOpen(false);
      } else if (!typing && !e.metaKey && !e.ctrlKey && (e.key === "c" || e.key === "C")) {
        setCommenting((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commenting, draft]);

  const numbered = useMemo(
    () =>
      [...comments]
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map((c, i) => ({ ...c, n: i + 1 })),
    [comments],
  );

  const reveal = useCallback((c: ReviewComment) => {
    const el = findElement(c.selector);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setFlash(el);
    setTimeout(() => setFlash(null), 2200);
    return true;
  }, []);

  // Arriving from "Show" on another page: /en/journey/#review-<id>
  useEffect(() => {
    const id = location.hash.match(/^#review-(.+)$/)?.[1];
    const target = id && comments.find((c) => c.id === id);
    if (!target) return;
    history.replaceState(history.state, "", location.pathname + location.search);
    setTimeout(() => reveal(target), 400);
  }, [comments, reveal]);

  const save = async (text: string) => {
    if (!draft) return;
    const created = await addComment({
      text,
      locale,
      page,
      url: location.href,
      selector: cssPath(draft.el),
      tag: draft.el.tagName.toLowerCase(),
      quote: draft.quote || undefined,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      ...describe(draft.el),
    });
    setComments((list) => [...list, created]);
    setDraft(null);
  };

  const exit = () => {
    try {
      localStorage.removeItem(KEY_STORAGE);
    } catch {}
    location.reload();
  };

  const pagePins = numbered.filter((c) => c.page === page && c.status === "open");
  const openCount = comments.filter((c) => c.status === "open").length;

  return createPortal(
    <div data-review-ui>
      {hovered && <Box el={hovered} className="rv-hover" />}
      {draft && <Box el={draft.el} className="rv-hover rv-selected" />}
      {flash && <Box el={flash} className="rv-flash" />}

      {showPins &&
        pagePins.map((c) => {
          const el = findElement(c.selector);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          if (!r.width && !r.height) return null;
          return (
            <button
              key={c.id}
              type="button"
              className={`rv-pin${c.locale === locale ? "" : " rv-pin-other"}`}
              style={{ top: r.top + window.scrollY - 10, left: r.right + window.scrollX - 10 }}
              title={`(${c.locale.toUpperCase()}) ${c.text}`}
              onClick={() => setPanelOpen(true)}
            >
              {c.n}
            </button>
          );
        })}

      <div className="rv-toolbar" role="toolbar" aria-label="Review">
        <button
          type="button"
          className={`rv-btn${commenting ? " rv-btn-on" : ""}`}
          aria-pressed={commenting}
          onClick={() => setCommenting((v) => !v)}
          title="Shortcut: C"
        >
          {commenting ? "Click an element…" : "＋ Comment"}
        </button>
        <button type="button" className="rv-btn" onClick={() => setPanelOpen((v) => !v)}>
          Comments <span className="rv-count">{openCount}</span>
        </button>
        <button
          type="button"
          className="rv-btn rv-btn-icon"
          aria-pressed={showPins}
          onClick={() => setShowPins((v) => !v)}
          title={showPins ? "Hide pins" : "Show pins"}
        >
          {showPins ? "◉" : "○"}
        </button>
        <button type="button" className="rv-btn rv-btn-icon" onClick={exit} title="Leave review mode">
          ✕
        </button>
      </div>

      {error && <div className="rv-error">{error}</div>}

      {draft && (
        <Popover
          draft={draft}
          locale={locale}
          onCancel={() => setDraft(null)}
          onSave={save}
        />
      )}

      {panelOpen && (
        <Panel
          comments={numbered}
          page={page}
          locale={locale}
          shared={isShared}
          onClose={() => setPanelOpen(false)}
          onShow={(c) => {
            if (c.page === page && reveal(c)) return;
            location.href = withBase(`/${c.locale}${c.page}#review-${c.id}`);
          }}
          onStatus={async (c, status) => {
            await setStatus(c.id, status);
            refresh();
          }}
          onDelete={async (c) => {
            if (!confirm("Delete this comment?")) return;
            await deleteComment(c.id);
            refresh();
          }}
        />
      )}
    </div>,
    document.body,
  );
}

/** An outline drawn over an element without touching the page's own styles. */
function Box({ el, className }: { el: Element; className: string }) {
  const r = el.getBoundingClientRect();
  return (
    <div
      className={className}
      style={{ top: r.top - 3, left: r.left - 3, width: r.width + 6, height: r.height + 6 }}
    />
  );
}

function Popover({
  draft,
  locale,
  onCancel,
  onSave,
}: {
  draft: Draft;
  locale: string;
  onCancel: () => void;
  onSave: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { snippet, src } = describe(draft.el);

  // Next to the click, kept inside the window (a bottom sheet on phones, via CSS).
  const width = 340;
  const left = Math.min(Math.max(12, draft.x + 12), window.innerWidth - width - 12);
  const top = Math.min(Math.max(12, draft.y + 12), window.innerHeight - 380);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await onSave(text.trim());
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <form className="rv-popover" style={{ top, left, width }} onSubmit={submit}>
      <div className="rv-pop-head">
        <span className="rv-tag">{draft.el.tagName.toLowerCase()}</span>
        <span className="rv-badge">{locale.toUpperCase()}</span>
      </div>
      {draft.quote ? (
        <blockquote className="rv-quote">“{draft.quote}”</blockquote>
      ) : snippet ? (
        <p className="rv-snippet">{snippet}</p>
      ) : src ? (
        <p className="rv-snippet">{src.split("/").pop()}</p>
      ) : null}
      <textarea
        autoFocus
        rows={4}
        placeholder="What should change here?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
      />
      {error && <p className="rv-pop-error">{error}</p>}
      <div className="rv-pop-actions">
        <button type="button" className="rv-btn rv-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="rv-btn rv-btn-primary" disabled={!text.trim() || busy}>
          {busy ? "Saving…" : "Save comment"}
        </button>
      </div>
    </form>
  );
}

function Panel({
  comments,
  page,
  locale,
  shared,
  onClose,
  onShow,
  onStatus,
  onDelete,
}: {
  comments: (ReviewComment & { n: number })[];
  page: string;
  locale: string;
  shared: boolean;
  onClose: () => void;
  onShow: (c: ReviewComment) => void;
  onStatus: (c: ReviewComment, status: ReviewComment["status"]) => void;
  onDelete: (c: ReviewComment) => void;
}) {
  const [lang, setLang] = useState<string>("all");
  const [thisPage, setThisPage] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  const visible = comments
    .filter(
      (c) =>
        (lang === "all" || c.locale === lang) &&
        (!thisPage || c.page === page) &&
        (showResolved || c.status === "open"),
    )
    .reverse();

  return (
    <aside className="rv-panel" aria-label="Comments">
      <header className="rv-panel-head">
        <strong>Comments</strong>
        <button type="button" className="rv-btn rv-btn-icon" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </header>
      <div className="rv-filters">
        <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
          <option value="all">All languages</option>
          {locales.map((l) => (
            <option key={l} value={l}>
              {localeLabels[l]}
              {l === locale ? " (current)" : ""}
            </option>
          ))}
        </select>
        <label>
          <input type="checkbox" checked={thisPage} onChange={(e) => setThisPage(e.target.checked)} />
          This page only
        </label>
        <label>
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          Show resolved
        </label>
      </div>
      {!shared && (
        <p className="rv-note">Local mode: comments are saved in this browser only.</p>
      )}
      <ol className="rv-list">
        {visible.length === 0 && <li className="rv-empty">No comments here yet.</li>}
        {visible.map((c) => (
          <li key={c.id} className={`rv-item${c.status === "resolved" ? " rv-item-done" : ""}`}>
            <div className="rv-item-head">
              <span className="rv-num">{c.n}</span>
              <span className="rv-badge" title={localeLabels[c.locale as keyof typeof localeLabels]}>
                {c.locale.toUpperCase()}
              </span>
              <span className="rv-page">{c.page}</span>
              <span className="rv-meta">
                {formatDate(c.createdAt)}
              </span>
            </div>
            <p className="rv-text">{c.text}</p>
            {(c.quote || c.snippet) && (
              <p className="rv-snippet">
                <span className="rv-tag">{c.tag}</span> {c.quote ? `“${c.quote}”` : c.snippet}
              </p>
            )}
            <div className="rv-item-actions">
              <button type="button" onClick={() => onShow(c)}>
                Show
              </button>
              <button
                type="button"
                onClick={() => onStatus(c, c.status === "open" ? "resolved" : "open")}
              >
                {c.status === "open" ? "Resolve" : "Reopen"}
              </button>
              <button type="button" onClick={() => onDelete(c)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
