import { ShieldCheck, Quote } from "lucide-react";
import type { SectionProps } from "@/components/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials, metrics, clientLogos } from "@/content/proof";
import { tr } from "@/content/types";

export default function Proof({ lang, dict }: SectionProps) {
  return (
    <section id="confianza" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading kicker={dict.proof.kicker} title={dict.proof.title} sub={dict.proof.sub} />

        {/* Metrics */}
        <div data-reveal className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.value} className="bg-bg p-8 text-center">
              <p className="display text-4xl text-coral md:text-5xl">{m.value}</p>
              <p className="mt-2 text-sm text-fg-muted">{tr(m.label, lang)}</p>
            </div>
          ))}
        </div>

        {/* Client logos */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 rounded-2xl border border-line bg-surface/40 px-8 py-8">
          {clientLogos.map((logo) => (
            <span key={logo} className="display text-xl font-bold tracking-tight text-fg-dim/70">
              {logo}
            </span>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} data-reveal className="glass flex flex-col rounded-2xl p-7">
              <Quote size={22} className="text-coral" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-fg">
                {tr(t.quote, lang)}
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-5">
                <p className="text-sm font-medium text-fg">{t.author}</p>
                <p className="text-xs text-fg-dim">
                  {tr(t.role, lang)} · {t.company}
                </p>
                <p className="mono mt-3 inline-block rounded-full bg-coral/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-coral">
                  {tr(t.metric, lang)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Guarantee */}
        <div data-reveal className="mt-10 flex items-center gap-4 rounded-2xl border border-coral/30 bg-coral/[0.06] px-7 py-6">
          <ShieldCheck size={26} className="shrink-0 text-coral" />
          <p className="text-base font-medium text-fg">{dict.proof.guarantee}</p>
        </div>
      </div>
    </section>
  );
}
