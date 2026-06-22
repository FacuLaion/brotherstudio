import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/content/site";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a wa.me link from the configured WhatsApp number + a prefilled message. */
export function whatsappLink(lang: string) {
  const number = siteConfig.whatsapp.replace(/[^\d]/g, "");
  const message =
    lang === "es"
      ? "Hola Brother Studios, quiero hacer una consulta."
      : "Hi Brother Studios, I'd like to make an enquiry.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Two-digit, coral-friendly section index. */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** Locale-aware integer formatting for prices. */
export function formatPrice(value: number, lang: string) {
  return new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}
