/**
 * Shared gallery signal — mirrors the `immersive.ts` pattern.
 *
 * The hand gesture controller (GestureControl) WRITES this; the project
 * carousels and the hand cursor READ it. Two signals with very different
 * update rates are deliberately kept apart:
 *
 *  - Pointer position + "armed" ring: ~30 fps → driven purely by CSS custom
 *    properties / root data-attributes. NEVER touches React state, so it can't
 *    cause re-renders.
 *  - `focusedId` (changes rarely, with hysteresis) and a versioned `swipe`
 *    counter (one discrete event per flick): the only things exposed to React,
 *    via useSyncExternalStore.
 *
 * The carousels are fully autonomous (touch / arrows / dots / keyboard). This
 * module is a purely additive consumer of an imperative `next()/prev()` API —
 * with no camera, everything below is inert and the site behaves identically.
 */
import type Lenis from "lenis";

type Card = {
  el: HTMLElement;
  next: () => void;
  prev: () => void;
};

/** What React subscribers see. Reference changes only when something changes. */
export type GallerySnapshot = {
  focusedId: string | null;
  swipeId: string | null;
  swipeDir: -1 | 1;
  swipeSeq: number;
};

const SERVER_SNAPSHOT: GallerySnapshot = {
  focusedId: null,
  swipeId: null,
  swipeDir: 1,
  swipeSeq: 0,
};

// ---- hit-test tuning (px) ----
const INSET = 16; // shrink rect to ACQUIRE focus  (harder to enter)
const OUTSET = 24; // grow rect to KEEP focus       (harder to leave)
const CONFIRM_MS = 120; // a new candidate must persist this long before it wins
const GRACE_MS = 400; // keep last focus this long after the pointer leaves all cards

const cards = new Map<string, Card>();
const listeners = new Set<() => void>();

let snapshot: GallerySnapshot = SERVER_SNAPSHOT;

// focus state machine (not all of this is in the snapshot)
let focusedId: string | null = null;
let pendingId: string | null = null;
let pendingSince = 0;
let lostSince = 0;

// rect cache, invalidated on resize / Lenis scroll
const rectCache = new Map<string, DOMRect>();
let rectsDirty = true;
let domBound = false;
let lenisRef: Lenis | null = null;

function emit() {
  for (const l of listeners) l();
}

function bump(next: Partial<GallerySnapshot>) {
  snapshot = { ...snapshot, ...next };
  emit();
}

// ---------- DOM listeners (lazy, client-only) ----------
function markDirty() {
  rectsDirty = true;
}

function bindDom() {
  if (domBound || typeof window === "undefined") return;
  domBound = true;
  window.addEventListener("resize", markDirty, { passive: true });
  window.addEventListener("scroll", markDirty, { passive: true, capture: true });
}

/** Lenis drives scroll via transform, so window 'scroll' may not fire. */
export function bindLenis(instance: Lenis | null) {
  if (lenisRef === instance) return;
  lenisRef?.off?.("scroll", markDirty);
  lenisRef = instance;
  lenisRef?.on?.("scroll", markDirty);
}

function refreshRects() {
  rectCache.clear();
  for (const [id, card] of cards) rectCache.set(id, card.el.getBoundingClientRect());
  rectsDirty = false;
}

// ---------- registry ----------
export function registerCard(id: string, card: Card) {
  bindDom();
  cards.set(id, card);
  rectsDirty = true;
}

export function unregisterCard(id: string) {
  cards.delete(id);
  rectCache.delete(id);
  if (focusedId === id) setFocused(null);
}

export function getCard(id: string | null): Card | undefined {
  return id ? cards.get(id) : undefined;
}

// ---------- focus ----------
function within(px: number, py: number, r: DOMRect, margin: number) {
  // margin > 0 grows the rect (outset); margin < 0 shrinks it (inset)
  return px >= r.left - margin && px <= r.right + margin && py >= r.top - margin && py <= r.bottom + margin;
}

/** Schmitt-trigger hit test: a fresh card must be entered by its inset rect, but
 *  the current focus is only lost once the pointer leaves its outset rect. */
function hitTestRaw(px: number, py: number): string | null {
  for (const [id, r] of rectCache) {
    if (within(px, py, r, -INSET)) return id;
  }
  if (focusedId) {
    const r = rectCache.get(focusedId);
    if (r && within(px, py, r, OUTSET)) return focusedId;
  }
  return null;
}

function setFocused(id: string | null) {
  if (focusedId === id) return;
  focusedId = id;
  bump({ focusedId: id });
}

function updateFocus(px: number, py: number, now: number) {
  const raw = hitTestRaw(px, py);
  if (raw === focusedId) {
    pendingId = null;
    lostSince = 0;
    return;
  }
  if (raw !== null) {
    // temporal confirmation — kills flicker at the grid gap
    if (pendingId !== raw) {
      pendingId = raw;
      pendingSince = now;
    }
    if (now - pendingSince >= CONFIRM_MS) {
      setFocused(raw);
      pendingId = null;
    }
    lostSince = 0;
  } else {
    pendingId = null;
    if (focusedId !== null) {
      if (lostSince === 0) lostSince = now;
      if (now - lostSince >= GRACE_MS) {
        setFocused(null);
        lostSince = 0;
      }
    }
  }
}

// ---------- writers (called by GestureControl) ----------
const root = () => (typeof document !== "undefined" ? document.documentElement : null);

/**
 * @param xNorm/yNorm  index fingertip in normalized [0,1] camera coords
 * @param active       hand currently present
 */
export function setPointer(xNorm: number, yNorm: number, active: boolean) {
  const el = root();
  if (!el) return;
  if (!active) {
    el.removeAttribute("data-hand-pointer");
    // Let focus fade out after the grace period rather than sticking with no
    // cursor — but a 1–2 frame MediaPipe dropout won't clear it (< GRACE_MS).
    if (focusedId !== null) {
      const now = performance.now();
      if (lostSince === 0) lostSince = now;
      if (now - lostSince >= GRACE_MS) {
        setFocused(null);
        lostSince = 0;
      }
    }
    return;
  }
  // Camera preview is mirrored (-scale-x-100), so mirror X to match what the user sees.
  const px = (1 - xNorm) * window.innerWidth;
  const py = yNorm * window.innerHeight;
  el.style.setProperty("--hand-x", `${px.toFixed(1)}px`);
  el.style.setProperty("--hand-y", `${py.toFixed(1)}px`);
  el.setAttribute("data-hand-pointer", "1");

  if (rectsDirty) refreshRects();
  updateFocus(px, py, performance.now());
}

export function setArmed(on: boolean) {
  const el = root();
  if (!el) return;
  if (on) el.setAttribute("data-hand-armed", "1");
  else el.removeAttribute("data-hand-armed");
}

/**
 * Emit one slide step on the focused carousel.
 * @param screenDir  +1 = pointer flicked right on screen → next; -1 → prev.
 */
export function emitSwipe(screenDir: -1 | 1) {
  if (!focusedId) return;
  bump({ swipeId: focusedId, swipeDir: screenDir, swipeSeq: snapshot.swipeSeq + 1 });
}

/** Clear every transient when the camera turns off (called from stopAll). */
export function resetGallery() {
  const el = root();
  if (el) {
    el.removeAttribute("data-hand-pointer");
    el.removeAttribute("data-hand-armed");
  }
  pendingId = null;
  lostSince = 0;
  setFocused(null);
}

// ---------- React surface (useSyncExternalStore) ----------
export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getSnapshot() {
  return snapshot;
}

export function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}
