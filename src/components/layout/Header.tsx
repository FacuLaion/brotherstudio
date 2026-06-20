"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SectionProps } from "@/components/types";
import { siteConfig } from "@/content/site";
import { openCalendly } from "@/lib/calendly";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Header({ lang, dict }: SectionProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#manifiesto", label: dict.nav.manifesto },
    { href: "#servicios", label: dict.nav.services },
    { href: "#proyectos", label: dict.nav.work },
    { href: "#productos", label: dict.nav.products },
    { href: "#confianza", label: dict.nav.proof },
    { href: "#contacto", label: dict.nav.contact },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass border-b border-line/60" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="#top" className="group flex items-center gap-2" aria-label={siteConfig.name}>
          <span className="display text-base font-bold tracking-tight text-fg">
            Brother
          </span>
          <span className="display text-base font-bold tracking-tight text-fg-muted transition-colors group-hover:text-fg">
            Studios
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono text-xs uppercase tracking-wider text-fg-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitcher lang={lang} />
          <button
            type="button"
            onClick={() => openCalendly({ utmContent: "header" })}
            className="cursor-pointer rounded-full bg-coral px-5 py-2 text-sm font-medium text-bg transition-all duration-300 hover:bg-coral-bright hover:shadow-glow"
          >
            {dict.nav.bookCall}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-fg lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="glass border-t border-line/60 lg:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="mono py-2 text-sm uppercase tracking-wider text-fg-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-line pt-4">
              <LanguageSwitcher lang={lang} />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openCalendly({ utmContent: "header-mobile" });
                }}
                className="cursor-pointer rounded-full bg-coral px-5 py-2 text-sm font-medium text-bg"
              >
                {dict.nav.bookCall}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
