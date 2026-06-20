"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS, scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/** Right-side section navigation dots — reinforces the "move through the experience" feel. */
export function SectionNav() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Secciones"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      {SECTION_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollToId(id)}
          aria-label={id}
          aria-current={active === id ? "true" : undefined}
          className="group relative flex h-3 w-3 items-center justify-center"
        >
          <span
            className={cn(
              "block rounded-full transition-all duration-300",
              active === id ? "h-3 w-3 bg-coral" : "h-1.5 w-1.5 bg-fg-dim group-hover:bg-fg",
            )}
          />
        </button>
      ))}
    </nav>
  );
}
