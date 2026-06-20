"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Magnetic ring cursor with spring physics. Desktop pointers only; off under reduced-motion. */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0, scale: 1 });
    const xTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        gsap.to(ring, { opacity: 1, duration: 0.3 });
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as HTMLElement)?.closest?.("a, button, [data-cursor]");
      gsap.to(ring, { scale: interactive ? 2.4 : 1, duration: 0.3, ease: "power3" });
    };
    const onLeave = () => gsap.to(ring, { opacity: 0, duration: 0.3 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] h-7 w-7 rounded-full border border-coral mix-blend-difference will-change-transform"
    />
  );
}
