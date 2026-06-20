/**
 * Shared head-tracking signal. The gesture controller writes it (from
 * MediaPipe FaceLandmarker); the WebGL hero scene reads it in its render loop,
 * and CSS parallax layers read the mirrored values via custom properties.
 *
 * x, y are normalized roughly to [-1, 1] (0 = looking straight at the screen).
 */
export const headState = { x: 0, y: 0, active: false };

export function setHead(x: number, y: number) {
  headState.x = x;
  headState.y = y;
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--head-x", x.toFixed(4));
    root.style.setProperty("--head-y", y.toFixed(4));
  }
}

export function setHeadActive(active: boolean) {
  headState.active = active;
  if (!active) setHead(0, 0); // recenter when head tracking turns off
}
