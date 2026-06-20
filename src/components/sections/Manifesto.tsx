import type { SectionProps } from "@/components/types";
import { Kicker } from "@/components/ui/SectionHeading";

export default function Manifesto({ dict }: SectionProps) {
  return (
    <section id="manifiesto" className="relative px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto w-full max-w-5xl">
        <Kicker>{dict.manifesto.kicker}</Kicker>
        <div data-reveal className="mt-8 space-y-6">
          {dict.manifesto.lines.map((line, i) => (
            <p
              key={i}
              className="display text-pretty text-2xl leading-snug text-fg md:text-4xl"
            >
              {line}
            </p>
          ))}
        </div>
        <ul data-reveal className="mt-12 flex flex-wrap gap-3">
          {dict.manifesto.tags.map((tag) => (
            <li
              key={tag}
              className="mono rounded-full border border-line px-4 py-1.5 text-xs uppercase tracking-wider text-fg-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
