"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/content/types";
import { tr } from "@/content/types";
import { getDictionary } from "@/content/dictionary";
import {
  registerCard,
  unregisterCard,
  subscribe,
  getSnapshot,
  getServerSnapshot,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

const SWIPE_PX = 44; // min horizontal touch drag to count as a swipe

/** Branded fallback shown while an image loads or if its URL 404s. */
function gradientFor(i: number) {
  return i % 2 === 0
    ? "radial-gradient(120% 120% at 0% 0%, rgba(222,73,89,0.35), transparent 55%), linear-gradient(135deg, #16181d, #0a0a0b)"
    : "radial-gradient(120% 120% at 100% 0%, rgba(60,92,178,0.35), transparent 55%), linear-gradient(135deg, #16181d, #0a0a0b)";
}

/**
 * Autonomous project carousel. Fully usable with NO camera: touch swipe, arrow
 * buttons, dots and keyboard. It registers an imperative `next()/prev()` API so
 * the hand-gesture layer can drive it when this card is focused — but that layer
 * is purely additive; nothing here depends on it for navigation.
 */
export function ProjectCarousel({ project, lang }: { project: Project; lang: Locale }) {
  const t = getDictionary(lang).work.carousel;
  const slides = project.slides;
  const total = slides.length;

  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);
  const regionRef = useRef<HTMLDivElement>(null);

  // Infinite navigation: stepping past either end wraps around. The wrap frame is
  // an instant cut (animation off) so it loops cleanly instead of scrubbing the
  // whole strip backwards; normal steps stay animated.
  const go = useCallback(
    (dir: number) =>
      setCurrent((c) => {
        const nx = c + dir;
        if (nx < 0 || nx >= total) {
          setAnimate(false);
          return (nx + total) % total;
        }
        return nx;
      }),
    [total],
  );
  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);
  const goTo = useCallback((i: number) => setCurrent(((i % total) + total) % total), [total]);

  // Re-enable the slide animation on the frame after a wrap snap.
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // Register with the gesture store. next/prev are stable (functional updates),
  // so the stored refs stay valid for the component's lifetime.
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    registerCard(project.id, { el, next, prev });
    return () => unregisterCard(project.id);
  }, [project.id, next, prev]);

  // Focus highlight ONLY (low-frequency). Navigation never reads this.
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isFocused = snap.focusedId === project.id;

  // ---- touch swipe (mouse uses arrows / dots) ----
  const dragX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    dragX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(dx) > SWIPE_PX) (dx < 0 ? next : prev)();
  };

  // Arrow keys work when focus is anywhere inside the carousel (event bubbles up
  // from the focused arrow/dot button). Doesn't hijack global keys.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  return (
    <div
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={tr(project.name, lang)}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        dragX.current = null;
      }}
      className={cn(
        "group/car relative aspect-[16/10] select-none overflow-hidden [touch-action:pan-y]",
        isFocused && "card-focused",
      )}
    >
      {/* sliding track */}
      <div
        className="absolute inset-0 flex h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          transform: `translateX(-${current * 100}%)`,
          ...(animate ? null : { transition: "none" }),
        }}
      >
        {slides.map((s, i) => {
          // circular window: mount active ± 1 INCLUDING the wrap neighbours, so the
          // loop boundary is preloaded and never flashes the gradient fallback.
          const gap = Math.min(Math.abs(i - current), total - Math.abs(i - current));
          const windowed = gap <= 1;
          const active = i === current;
          return (
            <div
              key={s.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${t.slide} ${i + 1} / ${total}`}
              aria-hidden={!active}
              inert={!active || undefined}
              className="relative h-full w-full shrink-0"
              style={{ background: gradientFor(i) }}
            >
              {windowed && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${s.src}&w=1280`}
                  srcSet={`${s.src}&w=640 640w, ${s.src}&w=1024 1024w, ${s.src}&w=1600 1600w`}
                  sizes="(min-width: 768px) 600px, 100vw"
                  alt={tr(s.alt, lang)}
                  draggable={false}
                  loading={active ? "eager" : "lazy"}
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/car:scale-105"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* category badge (kept from the previous static visual) */}
      <span className="mono pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-fg-muted backdrop-blur">
        {tr(project.category, lang)}
      </span>

      {/* "in control" marker — appears when the hand pointer focuses this card */}
      <span
        aria-hidden={!isFocused}
        className={cn(
          "pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-coral/50 bg-coral/15 px-2.5 py-1 text-[0.6rem] uppercase tracking-wider text-coral backdrop-blur transition-opacity duration-200",
          isFocused ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="hand-dot h-1.5 w-1.5 rounded-full bg-coral" />
        {t.inControl}
      </span>

      {/* prev / next arrows — revealed on hover/focus, always visible on touch */}
      <button
        type="button"
        onClick={prev}
        aria-label={t.prev}
        className="glass absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-fg opacity-0 transition-opacity duration-200 hover:border-coral/60 focus-visible:opacity-100 group-hover/car:opacity-100 pointer-coarse:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label={t.next}
        className="glass absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-fg opacity-0 transition-opacity duration-200 hover:border-coral/60 focus-visible:opacity-100 group-hover/car:opacity-100 pointer-coarse:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* dots + position */}
      <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${t.slide} ${i + 1}`}
            aria-current={i === current}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-5 bg-coral" : "w-1.5 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
