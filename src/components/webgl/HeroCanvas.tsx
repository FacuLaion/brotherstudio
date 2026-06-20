"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Heavy WebGL tree — never SSR'd, mounted only after first paint to protect LCP.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroCanvas() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // WebGL2 capability check — fall back to the static gradient otherwise.
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return;

    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 250));
    const id = idle(() => setShow(true));
    return () => {
      if (window.cancelIdleCallback && typeof id === "number") window.cancelIdleCallback(id);
    };
  }, []);

  if (!show) return null;
  return (
    <div className="absolute inset-0 -z-10 opacity-0 [animation:fadeInScene_1.2s_ease_forwards] motion-reduce:hidden">
      <HeroScene />
    </div>
  );
}
