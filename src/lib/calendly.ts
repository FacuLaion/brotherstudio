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

  loadPromise = new Promise<void>((resolve, reject) => {
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
    // Blocked by an ad/consent blocker or offline → let callers fall back gracefully.
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Calendly widget failed to load"));
    };
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

/**
 * Mount the inline Calendly embed inside the given element (used on /agendar).
 * Returns `true` once the widget mounts, `false` if Calendly is unreachable
 * (blocked by a consent/ad blocker, offline, …) so the caller can show a fallback.
 */
export async function initInlineCalendly(parent: HTMLElement): Promise<boolean> {
  try {
    await ensureCalendly();
  } catch {
    return false;
  }
  if (!window.Calendly) return false;
  parent.innerHTML = "";
  window.Calendly.initInlineWidget({ url: siteConfig.calendlyUrl, parentElement: parent });
  return true;
}
