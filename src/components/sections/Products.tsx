import { Check, Clock, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/content/products";
import { tr } from "@/content/types";
import { BookCall } from "@/components/calendly/BookCall";
import { cn, formatPrice } from "@/lib/utils";

export default function Products({ lang, dict }: SectionProps) {
  return (
    <section id="productos" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading kicker={dict.products.kicker} title={dict.products.title} sub={dict.products.sub} />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            return (
              <article
                key={p.id}
                data-reveal
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-surface p-7 transition-transform duration-300 hover:-translate-y-1",
                  p.featured ? "border-coral shadow-glow" : "border-line",
                )}
              >
                {p.featured && <span aria-hidden className="beam-border" />}
                {p.featured && (
                  <span className="mono absolute -top-3 left-7 z-10 rounded-full bg-coral px-3 py-1 text-[0.65rem] uppercase tracking-wider text-bg">
                    {dict.products.popular}
                  </span>
                )}

                {/* Screenshot placeholder — replaced by real product shots */}
                <div
                  className="mb-6 flex aspect-video items-center justify-center rounded-lg border border-line"
                  style={{ background: "linear-gradient(135deg, #1b1e24, #0d0e11)" }}
                >
                  <span className="mono text-[0.6rem] uppercase tracking-widest text-fg-dim">
                    screenshot
                  </span>
                </div>

                <h3 className="display text-xl text-fg">{tr(p.name, lang)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{tr(p.tagline, lang)}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="mono text-sm text-fg-dim">{p.currency}</span>
                  <span className="display text-4xl text-fg">{formatPrice(p.price, lang)}</span>
                </div>
                {p.period && <p className="mt-1 text-xs text-fg-dim">{tr(p.period, lang)}</p>}

                <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-3 py-1">
                  <Clock size={12} className="text-coral" />
                  <span className="mono text-[0.65rem] uppercase tracking-wider text-coral">
                    {tr(p.turnaround, lang)}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-6">
                  {tr(p.deliverables, lang).map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-fg-muted">
                      <Check size={15} className="mt-0.5 shrink-0 text-coral" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col items-center gap-3">
                  {p.checkoutUrl ? (
                    <>
                      <a
                        href={p.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-medium text-bg transition-all duration-300 hover:bg-coral-bright hover:shadow-glow"
                      >
                        {dict.products.ctaBuyPrefix} {tr(p.name, lang)}
                        <ArrowRight size={15} />
                      </a>
                      <BookCall
                        variant="text"
                        productName={tr(p.name, lang)}
                        utmCampaign={`producto_${p.id}`}
                        utmContent="card_pricing"
                      >
                        {dict.products.ctaCall}
                      </BookCall>
                    </>
                  ) : (
                    <BookCall
                      variant="primary"
                      productName={tr(p.name, lang)}
                      utmCampaign={`producto_${p.id}`}
                      utmContent="card_pricing"
                      className="w-full"
                    >
                      {dict.products.ctaBuyPrefix} {tr(p.name, lang)}
                      <ArrowRight size={15} />
                    </BookCall>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 max-w-2xl text-sm text-fg-dim">{dict.products.note}</p>
      </div>
    </section>
  );
}
