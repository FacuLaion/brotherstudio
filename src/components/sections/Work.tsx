import { ArrowUpRight } from "lucide-react";
import type { SectionProps } from "@/components/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";
import { tr } from "@/content/types";
import { TiltCard } from "@/components/motion/TiltCard";

export default function Work({ lang, dict }: SectionProps) {
  return (
    <section id="proyectos" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading kicker={dict.work.kicker} title={dict.work.title} sub={dict.work.sub} />

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <TiltCard
              key={p.id}
              data-reveal
              className="group relative overflow-hidden rounded-2xl border border-line bg-surface hover:border-fg-dim"
            >
              {/* Placeholder visual — becomes the scroll-scrub still in M3 */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    background:
                      i % 2 === 0
                        ? "radial-gradient(120% 120% at 0% 0%, rgba(222,73,89,0.35), transparent 55%), linear-gradient(135deg, #16181d, #0a0a0b)"
                        : "radial-gradient(120% 120% at 100% 0%, rgba(60,92,178,0.35), transparent 55%), linear-gradient(135deg, #16181d, #0a0a0b)",
                  }}
                />
                <span className="mono absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-fg-muted backdrop-blur">
                  {tr(p.category, lang)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 p-7">
                <div>
                  <h3 className="display text-xl text-fg md:text-2xl">{tr(p.name, lang)}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                    {tr(p.description, lang)}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <li key={t} className="mono rounded border border-line px-2 py-0.5 text-[0.65rem] text-fg-dim">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="mt-1 shrink-0 text-fg-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral">
                  <ArrowUpRight size={22} />
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
