import { cn } from "@/lib/utils";

/** Soft drifting aurora glow behind a section. Pure CSS, decorative. */
export function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
    </div>
  );
}
