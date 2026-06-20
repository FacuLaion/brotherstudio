import type Lenis from "lenis";

/** Ordered section anchors — the single source of truth for section navigation. */
export const SECTION_IDS = [
  "top",
  "manifiesto",
  "servicios",
  "proyectos",
  "productos",
  "proceso",
  "confianza",
  "contacto",
] as const;

const HEADER_OFFSET = -72;

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Continuous relative scroll (px). Used by gaze control; routes through Lenis when active. */
export function scrollByPixels(delta: number) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const l = lenis as any;
  if (l && typeof l.scroll === "number") {
    l.scrollTo(l.scroll + delta, { immediate: true });
  } else {
    window.scrollBy(0, delta);
  }
}

/** Smoothly scroll to a section id. Used by anchors, keyboard, nav dots and gestures. */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.2 });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}

/** The convergence point: keyboard, nav dots and (later) hand gestures all call this. */
export function navigateToSection(dir: "next" | "prev" | "first" | "last") {
  if (typeof window === "undefined") return;
  const ids = SECTION_IDS;
  const mid = window.innerHeight * 0.35;
  let current = 0;
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= mid) current = i;
  });
  let target = current;
  if (dir === "next") target = Math.min(current + 1, ids.length - 1);
  else if (dir === "prev") target = Math.max(current - 1, 0);
  else if (dir === "first") target = 0;
  else if (dir === "last") target = ids.length - 1;
  scrollToId(ids[target]);
}
