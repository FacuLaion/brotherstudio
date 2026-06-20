import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
