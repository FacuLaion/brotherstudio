"use client";

import { useEffect, useRef } from "react";

/**
 * Coral particle trail that follows the pointer, plus a radiating burst on
 * click. Rendered on a dedicated full-screen canvas just under the magnetic
 * ring (z-[99]). Desktop fine-pointers only; off under reduced-motion.
 */
export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      max: number;
      r: number;
      bright: boolean;
    };
    const particles: P[] = [];
    const MAX = 360;

    const spawnTrail = (x: number, y: number) => {
      if (particles.length > MAX) return;
      const max = rand(0.45, 0.85);
      particles.push({
        x: x + rand(-2, 2),
        y: y + rand(-2, 2),
        vx: rand(-14, 14),
        vy: rand(-14, 6),
        life: max,
        max,
        r: rand(0.8, 2.4),
        bright: Math.random() < 0.3,
      });
    };

    const burst = (x: number, y: number) => {
      const n = 18;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + rand(-0.2, 0.2);
        const sp = rand(90, 230);
        const max = rand(0.5, 0.9);
        particles.push({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: max,
          max,
          r: rand(1, 2.8),
          bright: Math.random() < 0.5,
        });
      }
    };

    let px = -1;
    let py = -1;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (px >= 0) {
        // ~1 particle per 8px of travel, more when flicking fast.
        const n = Math.min(4, Math.floor(Math.hypot(x - px, y - py) / 8));
        for (let i = 0; i < n; i++) spawnTrail(x, y);
      }
      px = x;
      py = y;
    };
    const onDown = (e: MouseEvent) => burst(e.clientX, e.clientY);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        p.vx *= 0.92; // drag
        p.vy = p.vy * 0.92 + 28 * dt; // drag + faint gravity
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const t = p.life / p.max;
        const alpha = t * 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.4 + 0.6 * t), 0, Math.PI * 2);
        ctx.fillStyle = p.bright
          ? `rgba(255, 93, 108, ${alpha})`
          : `rgba(222, 73, 89, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[99] motion-reduce:hidden"
    />
  );
}
