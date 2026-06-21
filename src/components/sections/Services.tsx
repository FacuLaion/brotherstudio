import { Check } from "lucide-react";
import type { SectionProps } from "@/components/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/content/services";
import { tr } from "@/content/types";
import { pad2 } from "@/lib/utils";
import { SpotlightGrid } from "@/components/motion/SpotlightGrid";

export default function Services({ lang, dict }: SectionProps) {
  return (
    <section id="servicios" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading kicker={dict.services.kicker} title={dict.services.title} sub={dict.services.sub} />

        <SpotlightGrid className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.id}
              data-reveal
              className="group relative bg-bg p-8 transition-colors duration-300 hover:bg-surface md:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-sm text-coral">{pad2(s.index)}</span>
                <span className="h-px w-12 bg-line transition-all duration-300 group-hover:w-20 group-hover:bg-coral" />
              </div>
              <h3 className="display mt-6 text-2xl text-fg md:text-3xl">{tr(s.title, lang)}</h3>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">{tr(s.outcome, lang)}</p>
              <ul className="mt-6 space-y-2.5">
                {tr(s.bullets, lang).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-fg-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-coral" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SpotlightGrid>
      </div>
    </section>
  );
}
