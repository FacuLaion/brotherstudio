import type { SectionProps } from "@/components/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/content/proof";
import { tr } from "@/content/types";
import { pad2 } from "@/lib/utils";
import { RevealBeam } from "@/components/motion/RevealBeam";

export default function Process({ lang, dict }: SectionProps) {
  return (
    <section id="proceso" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading kicker={dict.process.kicker} title={dict.process.title} sub={dict.process.sub} />

        <RevealBeam className="mt-14" />

        <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.index} data-reveal className="relative bg-bg p-8">
              <span className="display text-5xl text-line">{pad2(step.index)}</span>
              <span className="absolute right-8 top-8 h-2 w-2 rounded-full bg-coral" />
              <h3 className="display mt-4 text-lg text-fg">{tr(step.title, lang)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{tr(step.description, lang)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
