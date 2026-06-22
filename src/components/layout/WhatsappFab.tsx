import type { Locale } from "@/lib/i18n";
import { WhatsappIcon } from "@/components/ui/SocialIcons";
import { whatsappLink } from "@/lib/utils";

/** Floating WhatsApp button, fixed bottom-right across the whole site. */
export function WhatsappFab({ lang, label }: { lang: Locale; label: string }) {
  return (
    <a
      href={whatsappLink(lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="group fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <WhatsappIcon size={28} />
    </a>
  );
}
