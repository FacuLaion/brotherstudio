"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*";

/** Terminal-style scramble/decrypt effect that resolves when scrolled into view. */
export function DecryptText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text); // SSR / no-JS / reduced-motion show final text

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let started = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    const scramble = () => {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < iteration) return text[i];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(""),
        );
        if (iteration >= text.length) {
          if (interval) clearInterval(interval);
          setDisplay(text);
        }
        iteration += 1 / 2;
      }, 40);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            scramble();
          }
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
