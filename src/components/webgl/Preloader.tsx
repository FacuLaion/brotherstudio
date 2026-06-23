"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

/** One-time cinematic intro (per session). Skipped under reduced-motion. */
export function Preloader() {
  const pathname = usePathname();
  // The intro belongs ONLY on the landing route (/es, /en). It must never run
  // on a content sub-page (/precios, /agendar) — a full-screen overlay there
  // would strand the user behind a black screen if anything stalls hydration.
  const isHome = /^\/[a-z]{2}\/?$/.test(pathname ?? "");
  const overlay = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Skip the intro on sub-pages, under reduced motion, or after the first
    // visit. Defer the dismiss to the next frame so we never setState
    // synchronously in the effect body (render already hides it on sub-pages).
    const skip =
      !isHome ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("bs-intro") !== null;
    if (skip) {
      const raf = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(raf);
    }
    sessionStorage.setItem("bs-intro", "1");
    document.body.style.overflow = "hidden";

    const finish = () => {
      document.body.style.overflow = "";
      setDone(true);
    };
    // Failsafe: never keep the overlay up for more than ~3.5s, even if a GSAP
    // callback never fires (backgrounded tab, blocked timers, …).
    const failsafe = window.setTimeout(finish, 3500);

    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.round(counter.v)),
      onComplete: () => {
        gsap.to(overlay.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: finish,
        });
      },
    });

    return () => {
      clearTimeout(failsafe);
      tween.kill();
      document.body.style.overflow = "";
    };
  }, [isHome]);

  if (done || !isHome) return null;

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
    >
      <div className="flex items-center gap-2">
        <span className="display text-2xl font-bold tracking-tight text-fg">Brother Studios</span>
        <span className="h-2 w-2 rounded-full bg-coral" />
      </div>
      <div className="mt-6 h-px w-56 overflow-hidden bg-line">
        <div className="h-full bg-coral transition-[width] duration-100 ease-linear" style={{ width: `${pct}%` }} />
      </div>
      <span className="mono mt-3 text-xs text-fg-dim">{pct}%</span>
    </div>
  );
}
