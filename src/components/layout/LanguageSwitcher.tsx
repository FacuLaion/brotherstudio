"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  function swapLocale(target: Locale) {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }

  return (
    <div className="mono flex items-center text-xs">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          <Link
            href={swapLocale(l)}
            aria-current={l === lang ? "true" : undefined}
            className={cn(
              "uppercase tracking-wider transition-colors",
              l === lang ? "text-fg" : "text-fg-dim hover:text-fg",
            )}
          >
            {l}
          </Link>
          {i < locales.length - 1 && <span className="mx-1.5 text-fg-dim">/</span>}
        </span>
      ))}
    </div>
  );
}
