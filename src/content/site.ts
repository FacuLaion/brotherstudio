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
  whatsapp: "+54 9 11 3580 8601", // contact number for site enquiries
  /** Calendly event URL. Create a custom question on the event to receive the product name. */
  calendlyUrl: "https://calendly.com/brotherstudio/15min",
  social: {
    instagram: "https://instagram.com/brotherstudio",
    linkedin: "https://linkedin.com/company/brotherstudio",
    github: "https://github.com/brotherstudio",
  },
  // ----------------------------------------------
} as const;

export type SiteConfig = typeof siteConfig;
