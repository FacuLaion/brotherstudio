import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  primary: "bg-coral text-bg px-6 py-3 hover:bg-coral-bright hover:shadow-glow",
  secondary:
    "border border-line text-fg px-6 py-3 hover:border-fg-dim hover:bg-white/[0.04]",
  ghost: "text-fg-muted hover:text-fg px-3 py-2",
};

export function ButtonLink({
  href,
  variant = "primary",
  external = false,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a href={href} className={cn(base, variants[variant], className)} {...externalProps}>
      {children}
    </a>
  );
}
