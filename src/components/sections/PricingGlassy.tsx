import { Check, Clock, ArrowRight } from "lucide-react";
import type { SectionProps } from "@/components/types";
import { Aurora } from "@/components/ui/Aurora";
import { GlowRing } from "@/components/ui/GlowRing";
import { BookCall } from "@/components/calendly/BookCall";
import { products } from "@/content/products";
import { tr } from "@/content/types";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Glassy pricing surface (adapted from a 21st.dev "animated glassy pricing"
 * block). On-brand: coral accents, our design tokens, the lightweight CSS
 * Aurora glow instead of a second full-screen WebGL shader, and our real
 * fixed-price products with the shared BookCall CTA. Used on /precios.
 */
export function PricingGlassy({ lang, dict }: SectionProps) {
  return (
    <section className="relative isolate w-full overflow-hidden px-6 py-24 md:px-10 md:py-32">
      <Aurora className="z-0" />
      <GlowRing className="z-0 top-[58%]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mono text-xs uppercase tracking-[0.2em] text-coral">
            {dict.pricing.kicker}
          </span>
          <h1 className="display mt-5 bg-gradient-to-r from-fg via-coral to-coral-bright bg-clip-text text-4xl font-light tracking-tight text-transparent md:text-6xl">
            {dict.pricing.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-fg-muted md:text-lg">
            {dict.pricing.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-7 shadow-xl backdrop-blur-[14px] transition-transform duration-300 hover:-translate-y-1",
                p.featured
                  ? "border-coral/40 bg-gradient-to-br from-coral/[0.14] to-white/[0.03] ring-2 ring-coral/25 shadow-glow lg:scale-[1.03]"
                  : "border-line bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
              )}
            >
              {p.featured && (
                <span className="mono absolute -top-3 left-7 z-10 rounded-full bg-coral px-3 py-1 text-[0.65rem] uppercase tracking-wider text-bg">
                  {dict.products.popular}
                </span>
              )}

              <h2 className="display text-2xl font-light tracking-tight text-fg">
                {tr(p.name, lang)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{tr(p.tagline, lang)}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="mono text-sm text-fg-dim">{p.currency}</span>
                <span className="display text-4xl font-light text-fg">
                  {formatPrice(p.price, lang)}
                </span>
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

              <BookCall
                variant={p.featured ? "primary" : "secondary"}
                productName={tr(p.name, lang)}
                utmCampaign={`precios_${p.id}`}
                utmContent="card_pricing_glassy"
                className="mt-7 w-full"
              >
                {dict.products.ctaBuyPrefix} {tr(p.name, lang)}
                <ArrowRight size={15} />
              </BookCall>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-fg-dim">
          {dict.products.note}
        </p>
      </div>
    </section>
  );
}
