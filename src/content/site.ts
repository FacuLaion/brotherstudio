/**
 * Global, non-localized site configuration.
 * Replace the PLACEHOLDER values with the client's real data.
 */
export const siteConfig = {
  name: "Brother Studios",
  domain: "brotherstudio.pro",
  url: "https://brotherstudio.pro",

  // --- PLACEHOLDERS: replace with real values ---
  email: "hola@brotherstudio.pro",
  whatsapp: "", // e.g. "+54 9 11 0000 0000"
  /** Calendly event URL. Create a custom question on the event to receive the product name. */
  calendlyUrl: "https://calendly.com/brotherstudio/30min",
  social: {
    instagram: "https://instagram.com/brotherstudio",
    linkedin: "https://linkedin.com/company/brotherstudio",
    github: "https://github.com/brotherstudio",
  },
  // ----------------------------------------------
} as const;

export type SiteConfig = typeof siteConfig;
