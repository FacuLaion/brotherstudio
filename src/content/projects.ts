import type { Project } from "./types";

/**
 * Showcase projects. PLACEHOLDER content + /public/work/*.svg stills.
 * In M3 these become the scroll-scrub camera journey.
 */
export const projects: Project[] = [
  {
    id: "saas-dashboard",
    name: { es: "Panel SaaS analítico", en: "Analytics SaaS dashboard" },
    category: { es: "Producto · Web App", en: "Product · Web App" },
    description: {
      es: "Dashboard en tiempo real para visualizar datos críticos con menos carga cognitiva.",
      en: "Real-time dashboard to visualize critical data with less cognitive load.",
    },
    tags: ["Next.js", "WebGL", "Charts"],
    image: "/work/saas-dashboard.svg",
  },
  {
    id: "configurator",
    name: { es: "Configurador 3D de producto", en: "3D product configurator" },
    category: { es: "E-commerce · 3D", en: "E-commerce · 3D" },
    description: {
      es: "Configurador en tiempo real que dejó al cliente personalizar y comprar en el navegador.",
      en: "Real-time configurator letting customers personalize and buy in the browser.",
    },
    tags: ["Three.js", "R3F", "Shopify"],
    image: "/work/configurator.svg",
  },
  {
    id: "whatsapp-bot",
    name: { es: "Bot de ventas WhatsApp", en: "WhatsApp sales bot" },
    category: { es: "IA · Automatización", en: "AI · Automation" },
    description: {
      es: "Agente que califica leads y agenda reuniones automáticamente, 24/7.",
      en: "Agent that qualifies leads and books meetings automatically, 24/7.",
    },
    tags: ["IA", "WhatsApp API", "n8n"],
    image: "/work/whatsapp-bot.svg",
  },
  {
    id: "real-estate",
    name: { es: "Portal inmobiliario inmersivo", en: "Immersive real-estate portal" },
    category: { es: "Web · Inmersivo", en: "Web · Immersive" },
    description: {
      es: "Recorridos de propiedades como herramienta de venta, no como folleto.",
      en: "Property tours as a sales tool, not a brochure.",
    },
    tags: ["WebGL", "Next.js", "CMS"],
    image: "/work/real-estate.svg",
  },
];
