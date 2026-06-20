"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/** One-time cinematic intro (per session). Skipped under reduced-motion. */
export function Preloader() {
  const overlay = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem("bs-intro")) {
      setDone(true);
      return;
    }
    sessionStorage.setItem("bs-intro", "1");
    document.body.style.overflow = "hidden";

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
          onComplete: () => {
            document.body.style.overflow = "";
            setDone(true);
          },
        });
      },
    });

    return () => {
      tween.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

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
