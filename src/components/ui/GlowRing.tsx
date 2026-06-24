import { cn } from "@/lib/utils";

/**
 * Decorative coral light-ring that sits behind a section's content.
 * Pure CSS: a crisp coral rim with a soft inner/outer bloom and a faint
 * concentric ring for depth, gently breathing. Brand coral tokens.
 * aria-hidden + pointer-events-none; the global reduced-motion net stops it.
 */
export function GlowRing({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(92vw,760px)] -translate-x-1/2 -translate-y-1/2",
        className,
      )}
    >
      <div className="glow-ring absolute inset-0">
        {/* soft outer bloom around the rim */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_60%,rgba(222,73,89,0.22)_67%,transparent_77%)] blur-xl" />
        {/* the crisp coral rim with inner + outer glow */}
        <div className="absolute inset-0 rounded-full border-2 border-coral/70 shadow-[0_0_70px_-4px_rgba(222,73,89,0.45),inset_0_0_90px_-14px_rgba(222,73,89,0.32)]" />
        {/* faint concentric ring for depth */}
        <div className="absolute inset-[13%] rounded-full border border-coral/20" />
      </div>
    </div>
  );
}
