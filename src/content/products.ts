import type { ProductPlan } from "./types";

/**
 * "Productos enlatados" — fixed-price, ready-made offerings.
 * PLACEHOLDER prices & screenshots: replace with the client's real values.
 * Screenshot paths point to /public/products/*.svg placeholders for now.
 */
export const products: ProductPlan[] = [
  {
    id: "landing",
    name: { es: "Landing de alta conversión", en: "High-conversion landing" },
    tagline: {
      es: "Una página que vende mientras dormís.",
      en: "A page that sells while you sleep.",
    },
    price: 900,
    currency: "USD",
    turnaround: { es: "Lista en 3 días", en: "Live in 3 days" },
    deliverables: {
      es: [
        "Diseño premium a tu marca",
        "Copywriting orientado a conversión",
        "Formularios + analytics",
        "Optimizada para móvil y SEO",
      ],
      en: [
        "Premium on-brand design",
        "Conversion-focused copywriting",
        "Forms + analytics",
        "Mobile & SEO optimized",
      ],
    },
    screenshots: ["/products/landing-1.svg", "/products/landing-2.svg"],
  },
  {
    id: "ai-agent",
    name: { es: "Agente de IA 24/7", en: "24/7 AI agent" },
    tagline: {
      es: "Atiende, califica y vende sin parar.",
      en: "Supports, qualifies and sells nonstop.",
    },
    price: 1500,
    currency: "USD",
    period: { es: "+ desde USD 99/mes", en: "+ from USD 99/mo" },
    turnaround: { es: "Listo en 7 días", en: "Live in 7 days" },
    featured: true,
    deliverables: {
      es: [
        "Chat + voz entrenados con tu negocio",
        "Integrado a WhatsApp y a tu web",
        "Conectado a tus datos (RAG)",
        "Panel de métricas y handoff humano",
      ],
      en: [
        "Chat + voice trained on your business",
        "Integrated with WhatsApp & your site",
        "Connected to your data (RAG)",
        "Metrics dashboard + human handoff",
      ],
    },
    screenshots: ["/products/ai-agent-1.svg", "/products/ai-agent-2.svg"],
  },
  {
    id: "automation",
    name: { es: "Motor de automatización", en: "Automation engine" },
    tagline: {
      es: "Tus herramientas, trabajando solas.",
      en: "Your tools, working on their own.",
    },
    price: 1200,
    currency: "USD",
    turnaround: { es: "Listo en 5 días", en: "Live in 5 days" },
    deliverables: {
      es: [
        "Hasta 5 flujos a medida (n8n / Make)",
        "Conecta CRM, email, facturación",
        "Alertas y reportes automáticos",
        "Documentación y soporte",
      ],
      en: [
        "Up to 5 custom flows (n8n / Make)",
        "Connects CRM, email, billing",
        "Automatic alerts & reports",
        "Documentation & support",
      ],
    },
    screenshots: ["/products/automation-1.svg", "/products/automation-2.svg"],
  },
  {
    id: "web-cms",
    name: { es: "Web corporativa + CMS", en: "Corporate site + CMS" },
    tagline: {
      es: "Tu empresa, presentada como se merece.",
      en: "Your company, presented as it deserves.",
    },
    price: 1900,
    currency: "USD",
    turnaround: { es: "Lista en 7 días", en: "Live in 7 days" },
    deliverables: {
      es: [
        "Sitio multipágina editable",
        "CMS para tu equipo",
        "Blog + multilenguaje",
        "Hosting y deploy incluidos",
      ],
      en: [
        "Editable multi-page site",
        "CMS for your team",
        "Blog + multi-language",
        "Hosting & deploy included",
      ],
    },
    screenshots: ["/products/web-cms-1.svg", "/products/web-cms-2.svg"],
  },
];
