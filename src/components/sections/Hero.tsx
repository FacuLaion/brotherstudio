import { ArrowDown, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/types";
import { ButtonLink } from "@/components/ui/Button";
import { BookCall } from "@/components/calendly/BookCall";
import { HeroCanvas } from "@/components/webgl/HeroCanvas";

export default function Hero({ dict }: SectionProps) {
  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 pt-28 md:px-10"
    >
      {/* Parallax background layer (grid + glows) — shifts with head tracking */}
      <div aria-hidden data-parallax="far" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(60% 60% at 50% 40%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(60% 60% at 50% 40%, black, transparent 80%)",
          }}
        />
        <div className="absolute -right-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-coral/20 blur-[140px]" />
        <div className="absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#3c5cb2]/15 blur-[140px]" />
      </div>
      {/* WebGL scene — its camera does its own head-coupled parallax */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <HeroCanvas />
      </div>

      <div data-parallax="near" className="mx-auto w-full max-w-7xl">
        <p className="kicker">{dict.hero.kicker}</p>
        <h1 className="display mt-7 max-w-5xl text-5xl text-fg sm:text-7xl lg:text-[5.5rem]">
          {dict.hero.headline}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted md:text-xl">
          {dict.hero.sub}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <ButtonLink href="#productos" variant="primary">
            {dict.hero.ctaPrimary}
            <ArrowRight size={16} />
          </ButtonLink>
          <BookCall variant="secondary" utmContent="hero">
            {dict.hero.ctaSecondary}
          </BookCall>
        </div>
      </div>

      <a
        href="#manifiesto"
        className="absolute inset-x-0 bottom-8 mx-auto flex w-fit items-center gap-2 text-fg-dim transition-colors hover:text-fg"
      >
        <span className="mono text-xs uppercase tracking-widest">{dict.hero.scrollHint}</span>
        <ArrowDown size={14} className="animate-bounce" />
      </a>
    </section>
  );
}
