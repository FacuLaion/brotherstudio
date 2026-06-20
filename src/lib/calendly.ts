import { siteConfig } from "@/content/site";

type CalendlyApi = {
  initPopupWidget: (opts: Record<string, unknown>) => void;
  initInlineWidget: (opts: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

let loadPromise: Promise<void> | null = null;

/** Lazily inject the Calendly widget assets (only on first use — keeps it off the critical path). */
function ensureCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve) => {
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(css);
    }
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
  return loadPromise;
}

export interface CalendlyOptions {
  /** Product name to prefill into the event's custom question (a1). */
  productName?: string;
  utmCampaign?: string;
  utmContent?: string;
}

/** Open the Calendly popup, prefilled + UTM-tagged for attribution. */
export async function openCalendly(opts: CalendlyOptions = {}) {
  await ensureCalendly();
  if (!window.Calendly) return;
  window.Calendly.initPopupWidget({
    url: siteConfig.calendlyUrl,
    prefill: opts.productName ? { customAnswers: { a1: opts.productName } } : undefined,
    utm: {
      utmSource: "portfolio",
      utmMedium: "web",
      utmCampaign: opts.utmCampaign ?? "home",
      ...(opts.utmContent ? { utmContent: opts.utmContent } : {}),
    },
  });
}

/** Mount the inline Calendly embed inside the given element (used on /agendar). */
export async function initInlineCalendly(parent: HTMLElement) {
  await ensureCalendly();
  if (!window.Calendly) return;
  parent.innerHTML = "";
  window.Calendly.initInlineWidget({ url: siteConfig.calendlyUrl, parentElement: parent });
}
