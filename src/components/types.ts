import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionary";

export interface SectionProps {
  lang: Locale;
  dict: Dictionary;
}
