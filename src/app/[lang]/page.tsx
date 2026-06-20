import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Products from "@/components/sections/Products";
import Process from "@/components/sections/Process";
import Proof from "@/components/sections/Proof";
import Contact from "@/components/sections/Contact";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const props = { lang, dict } as const;

  return (
    <>
      <Header {...props} />
      <main>
        <Hero {...props} />
        <Manifesto {...props} />
        <Services {...props} />
        <Work {...props} />
        <Products {...props} />
        <Process {...props} />
        <Proof {...props} />
        <Contact {...props} />
      </main>
      <Footer {...props} />
    </>
  );
}
