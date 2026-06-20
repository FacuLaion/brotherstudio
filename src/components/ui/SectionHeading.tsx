import { cn } from "@/lib/utils";

export function Kicker({ children, className }: { children: string; className?: string }) {
  return (
    <p className={cn("kicker flex items-center gap-2.5", className)}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral" />
      {children}
    </p>
  );
}

export function SectionHeading({
  kicker,
  title,
  sub,
  className,
}: {
  kicker: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div data-reveal className={cn("max-w-3xl", className)}>
      <Kicker>{kicker}</Kicker>
      <h2 className="display mt-5 text-4xl text-fg md:text-6xl">{title}</h2>
      {sub && <p className="mt-5 text-lg leading-relaxed text-fg-muted">{sub}</p>}
    </div>
  );
}
