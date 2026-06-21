import { ArrowRight, CalendarClock } from "lucide-react";
import type { SectionProps } from "@/components/types";
import { Kicker } from "@/components/ui/SectionHeading";
import { Aurora } from "@/components/ui/Aurora";
import { siteConfig } from "@/content/site";

export default function Contact({ lang, dict }: SectionProps) {
  return (
    <section id="contacto" className="relative px-6 py-28 md:px-10 md:py-40">
      <Aurora />
      <div className="mx-auto w-full max-w-5xl">
        <div data-reveal className="relative overflow-hidden rounded-3xl border border-line bg-surface p-10 md:p-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-coral/20 blur-[120px]"
          />
          <div className="relative">
            <Kicker>{dict.contact.kicker}</Kicker>
            <h2 className="display mt-6 max-w-2xl text-4xl text-fg md:text-6xl">
              {dict.contact.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">{dict.contact.sub}</p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href={`/${lang}/agendar`}
                className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-medium text-bg transition-all duration-300 hover:bg-coral-bright hover:shadow-glow"
              >
                <CalendarClock size={17} />
                {dict.contact.cta}
                <ArrowRight size={16} />
              </a>
              <p className="text-sm text-fg-muted">
                {dict.contact.or}{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-fg underline underline-offset-4 transition-colors hover:text-coral"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
