"use client";

import { useEffect, useRef } from "react";
import { initInlineCalendly } from "@/lib/calendly";

/** Inline Calendly embed — the highest-intent booking surface (used on /agendar). */
export function CalendlyInline() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) initInlineCalendly(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-[700px] w-full"
      style={{ minWidth: 320 }}
      aria-label="Calendario para agendar una llamada"
    />
  );
}
