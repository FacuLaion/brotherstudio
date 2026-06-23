import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { siteConfig } from "@/content/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PricingGlassy } from "@/components/sections/PricingGlassy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "es";
  const dict = getDictionary(locale);
  return {
    title: `${dict.pricing.title} — ${siteConfig.name}`,
    description: dict.pricing.subtitle,
    alternates: { canonical: `/${locale}/precios` },
  };
}

export default async function Precios({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const props = { lang, dict } as const;

  return (
    <>
      <Header {...props} />
      <main className="pt-24 md:pt-28">
        <div className="mx-auto w-full max-w-7xl px-6 pt-8 md:px-10">
          <a
            href={`/${lang}`}
            className="mono inline-flex items-center gap-2 text-xs uppercase tracking-wider text-fg-dim transition-colors hover:text-fg"
          >
            <ArrowLeft size={14} />
            {dict.pricing.back}
          </a>
        </div>
        <PricingGlassy {...props} />
      </main>
      <Footer {...props} />
    </>
  );
}
