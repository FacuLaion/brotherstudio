import type { Project } from "./types";

/**
 * Showcase projects. Slide imagery is TEMPORARY Unsplash stock
 * (`images.unsplash.com`, sized per-request in ProjectCarousel) — swap for real
 * client work later without touching the carousel. If a URL 404s the carousel
 * degrades each slide to a branded gradient, so it always looks intentional.
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
    slides: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=70",
        alt: { es: "Vista general del panel con métricas en tiempo real", en: "Dashboard overview with real-time metrics" },
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=70",
        alt: { es: "Gráficos de evolución y tendencias", en: "Trend and evolution charts" },
      },
      {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=70",
        alt: { es: "Equipo revisando los indicadores", en: "Team reviewing the KPIs" },
      },
      {
        src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=70",
        alt: { es: "Tableros de datos en pantalla", en: "Data boards on screen" },
      },
      {
        src: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=70",
        alt: { es: "Detalle de visualización de datos", en: "Data visualization detail" },
      },
    ],
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
    slides: [
      {
        src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=70",
        alt: { es: "Producto destacado en vista 3D", en: "Featured product in 3D view" },
      },
      {
        src: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&q=70",
        alt: { es: "Variante de color del producto", en: "Product color variant" },
      },
      {
        src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=70",
        alt: { es: "Detalle de materiales y texturas", en: "Materials and texture detail" },
      },
      {
        src: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=70",
        alt: { es: "Vista de compra final", en: "Final checkout view" },
      },
    ],
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
    slides: [
      {
        src: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=70",
        alt: { es: "Conversación de ventas en el teléfono", en: "Sales conversation on the phone" },
      },
      {
        src: "https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?auto=format&fit=crop&q=70",
        alt: { es: "Chat automatizado respondiendo un lead", en: "Automated chat answering a lead" },
      },
      {
        src: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&q=70",
        alt: { es: "Clientes interactuando por mensajería", en: "Customers engaging over messaging" },
      },
      {
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=70",
        alt: { es: "Panel de automatización del flujo", en: "Workflow automation panel" },
      },
    ],
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
    slides: [
      {
        src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=70",
        alt: { es: "Exterior de propiedad moderna", en: "Modern property exterior" },
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=70",
        alt: { es: "Fachada de la propiedad al atardecer", en: "Property façade at dusk" },
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=70",
        alt: { es: "Interior del living principal", en: "Main living room interior" },
      },
      {
        src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=70",
        alt: { es: "Recorrido por los ambientes", en: "Tour through the rooms" },
      },
      {
        src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=70",
        alt: { es: "Vista completa de la propiedad", en: "Full property view" },
      },
    ],
  },
];
