"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { initInlineCalendly } from "@/lib/calendly";
import { siteConfig } from "@/content/site";
import type { Locale } from "@/lib/i18n";

const COPY = {
  es: {
    failed: "No pudimos cargar el calendario aquí.",
    hint: "Puede que una extensión o el bloqueo de cookies lo esté impidiendo. Abrilo directamente:",
    cta: "Agendar en Calendly",
    or: "o escribinos a",
  },
  en: {
    failed: "We couldn't load the calendar here.",
    hint: "An extension or cookie blocker may be preventing it. Open it directly:",
    cta: "Book on Calendly",
    or: "or email us at",
  },
} as const;

/** Inline Calendly embed — the highest-intent booking surface (used on /agendar). */
export function CalendlyInline({ lang = "es" }: { lang?: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const t = COPY[lang] ?? COPY.es;

  useEffect(() => {
    let cancelled = false;
    if (!ref.current) return;

    initInlineCalendly(ref.current).then((mounted) => {
      if (cancelled) return;
      if (!mounted) {
        setFailed(true);
        return;
      }
      // The script may load but the iframe never paint (e.g. an iframe-blocking
      // consent tool). If nothing rendered shortly after, show the fallback too.
      window.setTimeout(() => {
        if (!cancelled && ref.current && !ref.current.querySelector("iframe")) {
          setFailed(true);
        }
      }, 4000);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <p className="text-lg text-fg">{t.failed}</p>
        <p className="max-w-md text-sm text-fg-muted">{t.hint}</p>
        <a
          href={siteConfig.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex items-center gap-2 rounded-full border border-line bg-fg px-6 py-3 text-xs uppercase tracking-wider text-bg transition-opacity hover:opacity-90"
        >
          {t.cta}
          <ArrowUpRight size={14} />
        </a>
        <p className="mono text-xs text-fg-dim">
          {t.or}{" "}
          <a href={`mailto:${siteConfig.email}`} className="underline hover:text-fg">
            {siteConfig.email}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="min-h-[700px] w-full"
      style={{ minWidth: 320 }}
      aria-label="Calendario para agendar una llamada"
    />
  );
}
