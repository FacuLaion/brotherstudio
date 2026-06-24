import type { Locale } from "@/lib/i18n";

/** A value translated into every supported locale. */
export type Localized<T = string> = Record<Locale, T>;

/** Resolve a localized value for the active language. */
export function tr<T>(value: Localized<T>, lang: Locale): T {
  return value[lang];
}

export interface Service {
  id: string;
  index: number;
  title: Localized;
  /** Outcome-first one-liner (sell the result, not the tech). */
  outcome: Localized;
  bullets: Localized<string[]>;
}

export interface ProductPlan {
  id: string;
  /** Marketing name. */
  name: Localized;
  /** Outcome tagline. */
  tagline: Localized;
  /** Fixed price, currency symbol de-emphasized in the UI. */
  price: number;
  currency: "USD" | "ARS";
  /** e.g. "/mes" for retainers; empty for one-off. */
  period?: Localized;
  /** Turnaround promise badge. */
  turnaround: Localized;
  deliverables: Localized<string[]>;
  /** Highlight as the anchor tier. */
  featured?: boolean;
  /** Real product screenshots (placeholder paths for now). */
  screenshots: string[];
  /** Optional checkout / intake URL; otherwise the CTA only books a call. */
  checkoutUrl?: string;
}

/** One slide inside a project's gesture-driven carousel. */
export interface ProjectSlide {
  /** Image URL (currently Unsplash; swap for real assets later). */
  src: string;
  /** Localized alt text for a11y. */
  alt: Localized;
}

export interface Project {
  id: string;
  name: Localized;
  category: Localized;
  description: Localized;
  tags: string[];
  /** Cover still — also used as the carousel's first slide fallback. */
  image: string;
  /** Carousel slides (4–5). Navigable by touch, arrows, keyboard and the hand gesture. */
  slides: ProjectSlide[];
}

export interface Testimonial {
  id: string;
  quote: Localized;
  author: string;
  role: Localized;
  company: string;
  /** A hard, measurable outcome. */
  metric: Localized;
  avatar?: string;
}

export interface Metric {
  value: string;
  label: Localized;
}

export interface ProcessStep {
  index: number;
  title: Localized;
  description: Localized;
}
