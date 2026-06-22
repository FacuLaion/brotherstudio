"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient particle field on a single full-page 2D canvas, behind all content
 * (-z-10). Slow-drifting coral motes with a gentle twinkle. Disabled under
 * reduced-motion; the rAF loop is paused while the tab is hidden.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    let w = 0;
    let h = 0;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      tw: number;
      ts: number;
      coral: boolean;
    };
    let particles: P[] = [];

    const build = () => {
      // ~1 mote per 18k px², capped so big screens stay cheap.
      const count = Math.min(90, Math.round((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.12, 0.12),
        vy: rand(-0.22, -0.04), // gentle upward drift
        r: rand(0.5, 1.7),
        a: rand(0.12, 0.5),
        tw: rand(0, Math.PI * 2),
        ts: rand(0.6, 1.6),
        coral: Math.random() < 0.45,
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += dt * p.ts;
        if (p.x < -4) p.x = w + 4;
        else if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        else if (p.y > h + 4) p.y = -4;
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.coral
          ? `rgba(222, 73, 89, ${alpha})`
          : `rgba(190, 200, 215, ${alpha * 0.8})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 motion-reduce:hidden"
    />
  );
}
