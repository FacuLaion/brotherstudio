"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, scrollToId, navigateToSection } from "@/lib/scroll";

/**
 * Headless provider: one Lenis smooth-scroll instance driven by a single GSAP
 * rAF loop (no double scheduling), smooth anchor clicks, and keyboard section
 * navigation. Fully disabled under prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth in-page anchor navigation (#section links).
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      history.pushState(null, "", href);
      scrollToId(id);
    };
    document.addEventListener("click", onClick);

    // Keyboard section navigation (the convergence point shared with gestures).
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      if (e.key === "PageDown") { e.preventDefault(); navigateToSection("next"); }
      else if (e.key === "PageUp") { e.preventDefault(); navigateToSection("prev"); }
      else if (e.key === "Home") { e.preventDefault(); navigateToSection("first"); }
      else if (e.key === "End") { e.preventDefault(); navigateToSection("last"); }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
