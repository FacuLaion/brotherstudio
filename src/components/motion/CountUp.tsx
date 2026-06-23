"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates the first number inside `value` from 0 to its target when scrolled
 * into view, preserving any prefix/suffix ("40+", "<7", "98%", "24/7").
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/\d+/);
  const hasNumber = match !== null;
  const target = match ? parseInt(match[0], 10) : 0;
  const [n, setN] = useState(0);

  // NOTE: depend on the primitives `target`/`hasNumber`, never on `match` —
  // `value.match()` returns a fresh array each render, which would re-run this
  // effect on every `setN` and spin up overlapping animations (numbers never
  // settle). Primitives keep the effect to a single run.
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasNumber) return;
    // Reduced motion → jump straight to the target on the first frame (dur 0),
    // so `setN` always happens inside rAF, never synchronously in the effect.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const dur = reduce ? 0 : 1300;
        const start = performance.now();
        const tick = (t: number) => {
          const p = dur === 0 ? 1 : Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, hasNumber]);

  if (!hasNumber) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {value.replace(/\d+/, String(n))}
    </span>
  );
}
