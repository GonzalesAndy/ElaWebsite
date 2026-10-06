"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  align: "start" | "end";
  label: string;
  /** Contents of the pill/header row. */
  trigger: React.ReactNode;
  closedWidth: string;
  openWidth: string;
  className?: string;
  children: (close: () => void) => React.ReactNode;
};

/**
 * A pill that morphs into a small frosted panel.
 * Opens on hover with a mouse, on tap with touch, and on Enter/Space with a keyboard.
 */
export default function MorphMenu({ align, label, trigger, closedWidth, openWidth, className, children }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const bodyId = useId();

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  return (
    <div
      ref={rootRef}
      className={`morph morph--${align} ${open ? "is-open" : ""} ${className ?? ""}`}
      style={{ "--closed-w": closedWidth, "--open-w": openWidth } as React.CSSProperties}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        window.clearTimeout(leaveTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        leaveTimer.current = window.setTimeout(() => setOpen(false), 180);
      }}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <div className="morph-panel">
        <span className="morph-bg" aria-hidden="true" />
        <button
          ref={triggerRef}
          type="button"
          className="morph-trigger"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={label}
          onClick={(e) => {
            // A mouse already opened it on hover — keep it open rather than toggling shut.
            const pointerType = (e.nativeEvent as PointerEvent).pointerType;
            setOpen((o) => (pointerType === "mouse" ? true : !o));
          }}
        >
          {trigger}
        </button>
        <div id={bodyId} className="morph-body" inert={!open}>
          <hr className="morph-divider" />
          {children(close)}
        </div>
      </div>
    </div>
  );
}
