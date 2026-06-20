import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Kicker } from "@/components/ui/SectionHeading";
import { CalendlyInline } from "@/components/calendly/CalendlyInline";

export default async function Agendar({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const props = { lang, dict } as const;

  return (
    <>
      <Header {...props} />
      <main className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <a
            href={`/${lang}`}
            className="mono inline-flex items-center gap-2 text-xs uppercase tracking-wider text-fg-dim transition-colors hover:text-fg"
          >
            <ArrowLeft size={14} />
            {lang === "es" ? "Volver" : "Back"}
          </a>
          <div className="mt-8 text-center">
            <Kicker>{dict.contact.kicker}</Kicker>
            <h1 className="display mt-5 text-4xl text-fg md:text-5xl">{dict.contact.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-fg-muted">{dict.contact.sub}</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface">
            <CalendlyInline />
          </div>
        </div>
      </main>
      <Footer {...props} />
    </>
  );
}
