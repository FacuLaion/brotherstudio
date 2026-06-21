"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor spotlight: the 1px grid gaps glow coral around the pointer (and a soft
 * wash over the cards). Pure CSS variables driven by mousemove — no re-renders.
 * Desktop pointers only; on touch it simply stays dark.
 */
export function SpotlightGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function setSpot(x: number, y: number) {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
  }

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setSpot(e.clientX - r.left, e.clientY - r.top);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setSpot(-400, -400)}
      className={cn("spotlight-grid", className)}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(340px circle at var(--spot-x, -400px) var(--spot-y, -400px), rgba(222,73,89,0.06), transparent 60%)",
        }}
      />
    </div>
  );
}
