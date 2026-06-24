import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { spaceGrotesk, jetbrainsMono } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import { siteConfig } from "@/content/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Reveals } from "@/components/motion/Reveals";
import { Cursor } from "@/components/motion/Cursor";
import { CursorParticles } from "@/components/motion/CursorParticles";
import { ParticleField } from "@/components/motion/ParticleField";
import { SectionNav } from "@/components/motion/SectionNav";
import { Preloader } from "@/components/webgl/Preloader";
import { GestureControl } from "@/components/gesture/GestureControl";
import { HandCursor } from "@/components/gesture/HandCursor";
import { WhatsappFab } from "@/components/layout/WhatsappFab";
import "../globals.css";

type LangParams = { params: Promise<{ lang: string }> };

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "es";
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <Preloader />
        <SmoothScroll />
        <ParticleField />
        <Reveals />
        <Cursor />
        <CursorParticles />
        <SectionNav />
        <GestureControl lang={lang} />
        <HandCursor />
        {children}
        <WhatsappFab lang={lang} label={dict.contact.whatsapp} />
      </body>
    </html>
  );
}
