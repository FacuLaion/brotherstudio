"use client";

import type { ReactNode } from "react";
import { openCalendly } from "@/lib/calendly";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "text";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-bg cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-coral text-bg px-6 py-3 text-sm hover:bg-coral-bright hover:shadow-glow",
  secondary:
    "border border-line text-fg px-6 py-3 text-sm hover:border-fg-dim hover:bg-white/[0.04]",
  text: "text-xs text-fg-dim underline-offset-4 hover:text-fg hover:underline px-1 py-1",
};

export function BookCall({
  children,
  productName,
  utmCampaign,
  utmContent,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  productName?: string;
  utmCampaign?: string;
  utmContent?: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openCalendly({ productName, utmCampaign, utmContent })}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </button>
  );
}
